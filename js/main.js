// ============================================
// Fuqiupu - 数据与交互逻辑
// ============================================

// 默认分类列表
const defaultCategories = [
  '建站实战',
  '量化投资',
  '海外营销',
  '副业创业',
  '技术趋势'
];

// 向后兼容：统一获取文章的分类数组（支持旧的 category 字符串和新的 categories 数组）
function getPostCategories(post) {
  if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
    return post.categories;
  }
  if (post.category && typeof post.category === 'string') {
    return [post.category];
  }
  return [];
}

// 获取分类列表（从 localStorage 读取，没有则使用默认）
function getCategories() {
  const saved = localStorage.getItem('blogCategories');
  if (saved) {
    return JSON.parse(saved);
  }
  return [...defaultCategories];
}

// 获取所有实际使用的分类（包括配置的分类和文章中使用的分类）
function getAllCategories() {
  const configCategories = getCategories();
  const postCategories = new Set();
  const allPosts = getAllPosts();
  allPosts.forEach(post => {
    getPostCategories(post).forEach(cat => postCategories.add(cat));
  });
  const allCategories = [...new Set([...configCategories, ...postCategories])];
  return allCategories.sort((a, b) => {
    const configIndexA = configCategories.indexOf(a);
    const configIndexB = configCategories.indexOf(b);
    if (configIndexA !== -1 && configIndexB !== -1) {
      return configIndexA - configIndexB;
    }
    if (configIndexA !== -1) return -1;
    if (configIndexB !== -1) return 1;
    return a.localeCompare(b, 'zh-CN');
  });
}

// 保存分类列表到 localStorage
function saveCategories(categories) {
  localStorage.setItem('blogCategories', JSON.stringify(categories));
}

// 添加分类
function addCategory(name) {
  const categories = getCategories();
  if (!categories.includes(name)) {
    categories.push(name);
    saveCategories(categories);
    return true;
  }
  return false;
}

// 删除分类
function deleteCategory(name) {
  const categories = getCategories();
  const index = categories.indexOf(name);
  if (index > -1) {
    categories.splice(index, 1);
    saveCategories(categories);
    return true;
  }
  return false;
}

// 重命名分类
function renameCategory(oldName, newName) {
  const categories = getCategories();
  const index = categories.indexOf(oldName);
  if (index > -1 && !categories.includes(newName)) {
    categories[index] = newName;
    saveCategories(categories);
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    posts.forEach(post => {
      // 兼容旧格式
      if (post.category === oldName) {
        post.category = newName;
      }
      // 新格式
      if (post.categories && Array.isArray(post.categories)) {
        const catIdx = post.categories.indexOf(oldName);
        if (catIdx > -1) {
          post.categories[catIdx] = newName;
        }
      }
    });
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    return true;
  }
  return false;
}

// 从 localStorage 读取用户发布的文章
function getPosts() {
  return JSON.parse(localStorage.getItem('blogPosts') || '[]');
}

// 云端文章数据（通过 fetch 异步加载）
let cloudPosts = [];
let cloudLoadError = null;

// 从云端加载文章数据（含重试机制）
async function loadCloudPosts() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch('posts.json?t=' + Date.now());
      if (response.ok) {
        cloudPosts = await response.json();
        cloudLoadError = null;
        // 将云端文章同步到本地缓存（离线备用）
        try {
          localStorage.setItem('cachedCloudPosts', JSON.stringify(cloudPosts));
        } catch(e) { /* localStorage 可能满 */ }
        return cloudPosts;
      }
    } catch (e) {
      console.log(`云端文章加载失败 (尝试 ${attempt + 1}/3)`, e);
    }
    if (attempt < 2) {
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  // 三次重试均失败，尝试读取本地缓存
  cloudLoadError = '云端加载失败，显示缓存数据';
  console.warn(cloudLoadError);
  try {
    const cached = localStorage.getItem('cachedCloudPosts');
    if (cached) {
      cloudPosts = JSON.parse(cached);
      return cloudPosts;
    }
  } catch(e) {}
  return [];
}

// 获取所有文章（合并云端和本地，去重）
function getAllPosts() {
  const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  const allPosts = [...cloudPosts, ...savedPosts];
  // 第一轮：按 id 去重
  const dedupedById = allPosts.filter((post, index, self) =>
    index === self.findIndex(p => p.id === post.id)
  );
  // 第二轮：按标题去重（防止云同步导致同文章不同 id 重复）
  const seenTitles = new Set();
  return dedupedById.filter(post => {
    const key = post.title.trim().toLowerCase();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });
}

let posts = getAllPosts();

// 根据 ID 获取文章
function getPostById(id) {
  return getAllPosts().find(post => post.id === parseInt(id));
}

// 根据分类获取文章（支持多标签：文章包含该分类即匹配）
function getPostsByCategory(category) {
  if (!category || category === '全部') return getAllPosts();
  return getAllPosts().filter(post => getPostCategories(post).includes(category));
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 搜索文章
function searchPosts(keyword) {
  if (!keyword || !keyword.trim()) return null;
  const kw = keyword.trim().toLowerCase();
  const allPosts = getAllPosts();
  return allPosts.filter(post => {
    if (post.title.toLowerCase().includes(kw)) return true;
    if (post.excerpt.toLowerCase().includes(kw)) return true;
    if (getPostCategories(post).some(cat => cat.toLowerCase().includes(kw))) return true;
    if (post.content.toLowerCase().includes(kw)) return true;
    return false;
  });
}

// 高亮关键词
function highlightText(text, keyword) {
  if (!keyword || !keyword.trim()) return text;
  const kw = keyword.trim();
  const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// ============================================
// 首页逻辑
// ============================================
function initHome() {
  const postsContainer = document.getElementById('posts-container');
  const categoryNav = document.getElementById('category-nav');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  if (!postsContainer) return;

  let currentCategory = '全部';
  let searchKeyword = '';

  // 渲染分类导航
  function renderCategories() {
    if (!categoryNav) return;
    const categories = ['全部', ...getAllCategories()];
    categoryNav.innerHTML = categories.map(cat => `
      <button class="category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    categoryNav.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        searchInput.value = '';
        searchKeyword = '';
        searchClear.style.display = 'none';
        renderCategories();
        renderPosts();
      });
    });
  }

  // 渲染文章列表
  function renderPosts() {
    let filteredPosts = getPostsByCategory(currentCategory);

    if (searchKeyword) {
      filteredPosts = filteredPosts.filter(post => {
        if (post.title.toLowerCase().includes(searchKeyword.toLowerCase())) return true;
        if (post.excerpt.toLowerCase().includes(searchKeyword.toLowerCase())) return true;
        if (getPostCategories(post).some(cat => cat.toLowerCase().includes(searchKeyword.toLowerCase()))) return true;
        if (post.content.toLowerCase().includes(searchKeyword.toLowerCase())) return true;
        return false;
      });
    }

    if (filteredPosts.length === 0) {
      postsContainer.innerHTML = `
        <div class="no-results">
          <p class="no-results__icon">🔍</p>
          <p class="no-results__text">没有找到相关文章</p>
          <p class="no-results__hint">试试其他关键词或分类</p>
        </div>
      `;
      return;
    }

    // 如果云端加载失败，显示提示横幅
    let cloudBanner = '';
    if (cloudLoadError && filteredPosts.length === 0 && getAllPosts().length === 0) {
      cloudBanner = '<div style="text-align:center;padding:12px 16px;background:#fef3c7;color:#92400e;border-radius:8px;margin-bottom:20px;font-size:0.9rem;">⚠️ 云端数据加载失败，且本地暂无文章。<a href="admin.html" style="color:#2563eb;text-decoration:underline;">前往管理后台发布</a></div>';
    }

    postsContainer.innerHTML = cloudBanner + filteredPosts.map(post => {
      const title = searchKeyword ? highlightText(post.title, searchKeyword) : post.title;
      const excerpt = searchKeyword ? highlightText(post.excerpt, searchKeyword) : post.excerpt;
      const postCats = getPostCategories(post);
      const catBadges = postCats.map(cat => {
        const catLabel = searchKeyword ? highlightText(cat, searchKeyword) : cat;
        return `<span class="post-card__category">${catLabel}</span>`;
      }).join('');
      return `
        <article class="post-card">
          <div class="post-card__body">
            <div class="post-card__categories">${catBadges}</div>
            <h3 class="post-card__title">
              <a href="post.html?id=${post.id}">${title}</a>
            </h3>
            <p class="post-card__excerpt">${excerpt}</p>
            <div class="post-card__meta">
              <span class="post-card__date">${formatDate(post.date)}</span>
              <span class="post-card__dot">·</span>
              <span class="post-card__readtime">${post.readTime}阅读</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // 搜索事件
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value;
      searchClear.style.display = searchKeyword ? 'block' : 'none';
      renderPosts();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchKeyword = '';
      searchClear.style.display = 'none';
      renderPosts();
      searchInput.focus();
    });
  }

  renderCategories();
  renderPosts();
}

// ============================================
// 文章详情页逻辑
// ============================================
function initPostDetail() {
  const postDetail = document.getElementById('post-detail');
  if (!postDetail) return;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const post = getPostById(postId);

  if (!post) {
    postDetail.innerHTML = `
      <div class="not-found">
        <h2>文章未找到</h2>
        <p>抱歉，您访问的文章不存在。</p>
        <a href="index.html" class="btn-back">返回首页</a>
      </div>
    `;
    return;
  }

  // 动态更新 SEO 标签
  document.title = `${post.title} - 实践录`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', post.excerpt.replace(/<[^>]+>/g, '').substring(0, 160));
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', post.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', post.excerpt.replace(/<[^>]+>/g, '').substring(0, 160));
  const ogUrl = document.getElementById('og-url');
  if (ogUrl) ogUrl.setAttribute('content', window.location.href);

  const postCats = getPostCategories(post);
  const catBadges = postCats.map(cat =>
    `<span class="post-content__category">${cat}</span>`
  ).join('');

  postDetail.innerHTML = `
    <article class="post-content">
      <a href="index.html" class="btn-back">← 返回首页</a>
      <div class="post-content__header">
        <div class="post-content__categories">${catBadges}</div>
        <h1 class="post-content__title">${post.title}</h1>
        <div class="post-content__meta">
          <span>${formatDate(post.date)}</span>
          <span class="dot">·</span>
          <span>${post.readTime}阅读</span>
          <span class="dot">·</span>
          <span>作者：${post.author}</span>
        </div>
      </div>
      <div class="post-content__body">
        ${post.content}
      </div>
    </article>
  `;

  // 渲染完成后构建目录和前后导航
  buildTOC();
  buildPostNav();
}

// ====== 上一篇 / 下一篇导航 ======
function buildPostNav() {
  const article = document.querySelector('.post-content');
  if (!article) return;

  const allPosts = getAllPosts();
  // 按日期降序排列（同首页顺序）
  const sorted = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const params = new URLSearchParams(window.location.search);
  const currentId = parseInt(params.get('id'));
  const currentIndex = sorted.findIndex(p => p.id === currentId);

  if (currentIndex === -1) return;

  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  if (!prev && !next) return;

  const nav = document.createElement('nav');
  nav.className = 'post-nav';
  nav.innerHTML = `
    ${prev ? `
      <a href="post.html?id=${prev.id}" class="post-nav__link post-nav__link--prev">
        <span class="post-nav__label">← 上一篇</span>
        <span class="post-nav__title">${prev.title}</span>
      </a>
    ` : '<span class="post-nav__link post-nav__link--prev post-nav__link--empty"></span>'}
    ${next ? `
      <a href="post.html?id=${next.id}" class="post-nav__link post-nav__link--next">
        <span class="post-nav__label">下一篇 →</span>
        <span class="post-nav__title">${next.title}</span>
      </a>
    ` : '<span class="post-nav__link post-nav__link--next post-nav__link--empty"></span>'}
  `;
  article.appendChild(nav);
}

// ====== 文章目录 (TOC) ======
function buildTOC() {
  const article = document.querySelector('.post-content__body');
  const desktopNav = document.getElementById('toc-nav-desktop');
  const mobileNav = document.getElementById('toc-nav-mobile');
  const sidebar = document.getElementById('toc-sidebar');

  if (!article || !desktopNav || !mobileNav) return;

  const headings = article.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    if (sidebar) sidebar.classList.add('toc-sidebar--empty');
    return;
  }

  // 给每个标题生成 id
  const items = [];
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'toc-' + i + '-' + encodeURIComponent(h.textContent.replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '').substring(0, 40));
    }
    items.push({
      id: h.id,
      text: h.textContent,
      level: h.tagName.toLowerCase()
    });
  });

  const html = items.map(item => `
    <li class="toc-sidebar__item ${item.level === 'h3' ? 'toc-sidebar__item--h3' : ''}">
      <a href="#${item.id}" data-toc="${item.id}">${item.text}</a>
    </li>
  `).join('');

  desktopNav.innerHTML = html;
  mobileNav.innerHTML = html.replace(/toc-sidebar__/g, 'toc-mobile__');

  // 点击目录项平滑滚动
  document.querySelectorAll('[data-toc]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-toc');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // 移动端点完后关闭目录
      const mobileDetails = document.getElementById('toc-mobile');
      if (mobileDetails) mobileDetails.open = false;
    });
  });

  // 启动滚动监听
  initScrollSpy(items);
}

function initScrollSpy(items) {
  const links = document.querySelectorAll('[data-toc]');
  if (links.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = document.querySelector(`[data-toc="${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: '-100px 0px -75% 0px'
  });

  items.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) observer.observe(el);
  });
}

// ============================================
// 移动端导航菜单
// ============================================
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

// ============================================
// 主题切换
// ============================================
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // 读取保存的主题，或跟随系统
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initMobileNav();
  // 先加载云端文章数据
  await loadCloudPosts();
  posts = getAllPosts();
  initHome();
  initPostDetail();
});
