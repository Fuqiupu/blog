/**
 * Markdown → HTML 转换 + 添加到 posts.json（可复用版）
 * 用法: node add-post.js <md文件路径> <标题> <摘要> <分类1,分类2>
 * 日期和 id 自动生成，阅读时长按字数估算。
 */
const fs = require('fs');
const path = require('path');

// ============ 读取参数 ============
const [, , mdPath, title, excerpt, categoriesCsv] = process.argv;
if (!mdPath || !title || !excerpt || !categoriesCsv) {
  console.log('用法: node add-post.js <md文件路径> <标题> <摘要> <分类1,分类2>');
  process.exit(1);
}
const categories = categoriesCsv.split(',').map(s => s.trim()).filter(Boolean);

const md = fs.readFileSync(path.resolve(mdPath), 'utf-8').replace(/\r\n/g, '\n');

// ============ Markdown → HTML 转换器 ============
function mdToHtml(markdown) {
  let html = markdown;

  // ---- 预处理：保护代码块 ----
  const codeBlocks = [];
  // 匹配 ```language\n...\n``` 的代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || '', code: code.trimEnd() });
    return `%%CODEBLOCK_${idx}%%`;
  });

  // 保护行内代码
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(code);
    return `%%INLINECODE_${idx}%%`;
  });

  // 保护图片（避免 ! 被误处理）
  const images = [];
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const idx = images.length;
    images.push({ alt, src });
    return `%%IMAGE_${idx}%%`;
  });

  // 保护链接
  const links = [];
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const idx = links.length;
    // 提取可选的 title 属性
    const titleMatch = url.match(/^(.+?)\s+"(.+)"$/);
    if (titleMatch) {
      links.push({ text, url: titleMatch[1], title: titleMatch[2] });
    } else {
      links.push({ text, url });
    }
    return `%%LINK_${idx}%%`;
  });

  // ---- 转换标题（从高到低，避免#冲突） ----
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // ---- 转换水平线 ----
  html = html.replace(/^(---|\*\*\*)$/gm, '<hr>');

  // ---- 转换表格 ----
  // 先合并连续的表格行，再处理
  html = html.replace(/^(\|.+\|)\n(\|[\s:\-|]+\|)\n((?:\|.+\|\n?)+)/gm, (match) => {
    const lines = match.trim().split('\n');
    if (lines.length < 2) return match;

    const headerLine = lines[0];
    // 跳过分隔行
    const headers = headerLine.split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const alignLine = lines[1];
    const aligns = alignLine.split('|').filter(c => c.trim() !== '').map(c => {
      const t = c.trim();
      if (t.startsWith(':') && t.endsWith(':')) return 'center';
      if (t.endsWith(':')) return 'right';
      return 'left';
    });

    let tableHtml = '<table><thead><tr>';
    headers.forEach((h, i) => {
      const al = aligns[i] || 'left';
      tableHtml += `<th style="text-align:${al}">${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').filter(c => c.trim() !== '').map(c => c.trim());
      tableHtml += '<tr>';
      cells.forEach((c, j) => {
        const al = aligns[j] || 'left';
        tableHtml += `<td style="text-align:${al}">${c}</td>`;
      });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';
    return tableHtml;
  });

  // ---- 转换引用块 ----
  // 先合并多行引用
  const blockquoteLines = [];
  html = html.replace(/^(>+.+)$/gm, (match) => {
    const idx = blockquoteLines.length;
    blockquoteLines.push(match);
    return `%%BQ_${idx}%%`;
  });

  // 合并连续的 %%BQ_%% 标记
  html = html.replace(/(%%BQ_\d+%%(\n%%BQ_\d+%%)*)/g, (match) => {
    const ids = match.split('\n').map(s => {
      const m = s.match(/%%BQ_(\d+)%%/);
      return parseInt(m[1]);
    });
    const lines = ids.map(i => blockquoteLines[i]);
    // 处理嵌套：计算每行的 > 数量
    let result = '';
    let currentLevel = 0;
    let currentContent = [];

    for (const line of lines) {
      const levelMatch = line.match(/^(>+)\s?(.*)$/);
      if (!levelMatch) continue;
      const level = levelMatch[1].length;
      const content = levelMatch[2];

      if (level === currentLevel && currentContent.length > 0) {
        currentContent.push(content);
      } else if (level > currentLevel) {
        if (currentContent.length > 0) {
          result += `<blockquote><p>${currentContent.join('<br>')}</p>`;
        }
        currentContent = [content];
        currentLevel = level;
      }
    }
    if (currentContent.length > 0) {
      result += `<blockquote><p>${currentContent.join('<br>')}</p></blockquote>`;
    }
    // Close remaining open blockquotes
    for (let i = 1; i < currentLevel; i++) {
      result += '</blockquote>';
    }
    return result;
  });

  // ---- 转换无序列表 ----
  // 合并连续的列表行
  html = html.replace(/(^[\t ]*[-*+] .+(\n|$))+/gm, (match) => {
    const lines = match.trimEnd().split('\n');
    let listHtml = '<ul>';
    for (const line of lines) {
      const content = line.replace(/^[\t ]*[-*+] /, '');
      // 处理缩进（子列表）
      if (line.match(/^ {2,4}[-*+] /) || line.match(/^\t[-*+] /)) {
        // 嵌套列表 - 简化处理
        listHtml = listHtml.replace(/<\/li>$/, '');
        listHtml += `<ul><li>${content}</li></ul></li>`;
      } else {
        listHtml += `<li>${content}</li>`;
      }
    }
    listHtml += '</ul>';
    return listHtml;
  });

  // ---- 转换有序列表 ----
  html = html.replace(/(^[\t ]*\d+\. .+(\n|$))+/gm, (match) => {
    const lines = match.trimEnd().split('\n');
    let listHtml = '<ol>';
    for (const line of lines) {
      const content = line.replace(/^[\t ]*\d+\. /, '');
      if (line.match(/^ {2,4}\d+\. /)) {
        listHtml = listHtml.replace(/<\/li>$/, '');
        listHtml += `<ol><li>${content}</li></ol></li>`;
      } else {
        listHtml += `<li>${content}</li>`;
      }
    }
    listHtml += '</ol>';
    return listHtml;
  });

  // ---- 任务清单 ----
  html = html.replace(/<li>\[x\] /gi, '<li>✅ ');
  html = html.replace(/<li>\[ \] /gi, '<li>⬜ ');

  // ---- 粗体、斜体、删除线 ----
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // ---- 脚注 ----
  html = html.replace(/\[\^(\d+)\]/g, '<sup><a href="#fn$1" id="fnref$1">[$1]</a></sup>');
  html = html.replace(/^\[\^(\d+)\]: (.+)$/gm, '<p id="fn$1"><small><a href="#fnref$1">[$1]</a> $2</small></p>');

  // ---- 恢复保护的内容（图片/链接/行内代码） ----
  // 注：代码块暂不恢复——等段落处理完成后再恢复，
  // 避免代码块内部的空行被当成段落分隔符切断。
  html = html.replace(/%%IMAGE_(\d+)%%/g, (_, idx) => {
    const img = images[idx];
    return `<img src="${img.src}" alt="${img.alt}">`;
  });

  html = html.replace(/%%LINK_(\d+)%%/g, (_, idx) => {
    const link = links[idx];
    if (link.title) {
      return `<a href="${link.url}" title="${link.title}">${link.text}</a>`;
    }
    return `<a href="${link.url}">${link.text}</a>`;
  });

  html = html.replace(/%%INLINECODE_(\d+)%%/g, (_, idx) => {
    return `<code>${inlineCodes[idx]}</code>`;
  });

  // ---- 段落处理 ----
  // 将连续的非HTML文本行合并为段落
  html = html.replace(/\n\n+/g, '\n\n');
  // 用双换行分割段落
  const blocks = html.split(/\n\n+/);
  const processed = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    // 如果已经是HTML块或代码块占位符，保持不变
    if (trimmed.match(/^<(h[1-6]|table|ul|ol|pre|blockquote|hr|img|p|div)/) ||
        trimmed.match(/^%%CODEBLOCK_\d+%%$/)) {
      return trimmed;
    }
    // 如果是单行，包装为段落
    if (!trimmed.includes('\n')) {
      return `<p>${trimmed}</p>`;
    }
    // 多行：用 <br> 连接
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  });

  html = processed.filter(b => b).join('\n');

  // 清理多余的空 blockquote 标记
  html = html.replace(/%%BQ_\d+%%/g, '');

  // ---- 最后恢复代码块 ----
  html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_, idx) => {
    const cb = codeBlocks[idx];
    if (cb.lang) {
      return `<pre><code class="language-${cb.lang}">${escapeHtml(cb.code)}</code></pre>`;
    }
    return `<pre><code>${escapeHtml(cb.code)}</code></pre>`;
  });

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============ 转换 ============
console.log('Converting Markdown to HTML...');
let contentHtml = mdToHtml(md);
// 移除 <h1>（标题由模板渲染，避免重复）
contentHtml = contentHtml.replace(/^<h1>[^<]+<\/h1>\n?/, '');
// 正文中的标题整体降一级（博客正文样式只定义到 h2/h3）
contentHtml = contentHtml
  .replace(/<h2>/g, '<h3>').replace(/<\/h2>/g, '</h3>')
  .replace(/<h1>/g, '<h2>').replace(/<\/h1>/g, '</h2>');

// ============ 估算阅读时长 ============
const cjkCount = (contentHtml.match(/[\u4e00-\u9fff]/g) || []).length;
const wordCount = (contentHtml.match(/[a-zA-Z0-9]+/g) || []).length;
const readTime = Math.max(1, Math.round((cjkCount + wordCount) / 300));
console.log(`字数估算: 中文 ${cjkCount} + 英文单词 ${wordCount} → ${readTime} 分钟`);

// ============ 构建新文章条目 ============
const now = new Date();
const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const dateCompact = dateStr.replace(/-/g, '');

const postsPath = path.join(__dirname, '..', 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

// 生成唯一 id（同日多篇自动递增）
let id = parseInt(dateCompact + '001', 10);
while (posts.some(p => p.id === id)) id += 1;

const newPost = {
  id: id,
  title: title,
  excerpt: excerpt,
  date: dateStr,
  readTime: `${readTime} 分钟`,
  author: 'Fuqiupu',
  content: contentHtml,
  categories: categories
};

// 检查重复
const exists = posts.find(p => p.id === newPost.id || p.title === newPost.title);
if (exists) {
  console.log('文章已存在，跳过添加。');
  process.exit(0);
}

// 插入到最前面（最新文章在前）
posts.unshift(newPost);

// 写回
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
console.log(`✅ 文章已添加！共 ${posts.length} 篇文章`);
console.log(`   id: ${newPost.id}`);
console.log(`   标题: ${newPost.title}`);
console.log(`   分类: ${newPost.categories.join(', ')}`);
console.log(`   日期: ${newPost.date} / 阅读时长: ${newPost.readTime}`);
