// ============================================
// 个人博客 - 数据与交互逻辑
// ============================================

// 默认分类列表
const defaultCategories = [
  '建站实战',
  '量化投资',
  '海外营销',
  '副业创业',
  '技术趋势'
];

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
  const allPosts = getPosts();
  allPosts.forEach(post => postCategories.add(post.category));
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
      if (post.category === oldName) {
        post.category = newName;
      }
    });
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    return true;
  }
  return false;
}

// 默认文章数据
const defaultPosts = [
  {
    id: 1,
    title: '从零搭建个人独立站：完整指南',
    excerpt: '从域名注册到网站部署，手把手教你搭建属于自己的个人博客独立站，涵盖技术选型和成本分析。',
    category: '建站实战',
    date: '2026-07-15',
    readTime: '15 分钟',
    author: '作者',
    content: `
      <p>搭建个人独立站是每个创作者都应该考虑的事情。它不仅是你的数字名片，更是你内容资产的真正归属。</p>
      <h2>为什么要建独立站？</h2>
      <p>在平台算法主导的时代，拥有自己的独立站点意味着真正掌握内容的分发权和用户关系。</p>
      <h2>技术选型</h2>
      <p>从静态站点生成器到全栈框架，选择适合自己的技术栈很重要。对于博客类站点，静态方案是首选。</p>
      <h2>成本分析</h2>
      <p>域名每年约 50-100 元，托管可以使用免费的 Vercel、Netlify 或 GitHub Pages，总体成本很低。</p>
      <h2>总结</h2>
      <p>动手开始吧，你的独立站就是你在数字世界的根据地。</p>
    `
  },
  {
    id: 2,
    title: '量化投资入门：从策略到实盘',
    excerpt: '量化投资不是神秘的黑箱。本文带你了解量化投资的基本概念、常见策略和实盘注意事项。',
    category: '量化投资',
    date: '2026-07-12',
    readTime: '12 分钟',
    author: '作者',
    content: `
      <p>量化投资是利用数学模型和计算机程序来进行投资决策的方法，它的核心是纪律性和系统性。</p>
      <h2>什么是量化投资？</h2>
      <p>简单来说，量化投资就是把你的投资逻辑写成代码，让程序帮你执行，避免情绪化决策。</p>
      <h2>常见策略类型</h2>
      <p>趋势跟踪、均值回归、套利策略、多因子模型是最常见的几大量化策略类型。</p>
      <h2>实盘注意事项</h2>
      <p>回测不等于实盘，滑点、手续费、流动性都是需要考虑的因素。从小资金开始，逐步验证。</p>
      <h2>风险提示</h2>
      <p>投资有风险，入市需谨慎。量化只是工具，不能消除风险，只能更系统地管理风险。</p>
    `
  },
  {
    id: 3,
    title: '海外营销：独立站流量获取实战',
    excerpt: '做跨境电商或海外内容创业，流量是关键。分享 SEO、社交媒体、付费广告等多种获客渠道的实操经验。',
    category: '海外营销',
    date: '2026-07-08',
    readTime: '18 分钟',
    author: '作者',
    content: `
      <p>海外市场虽然竞争激烈，但也充满机会。掌握正确的流量获取方法，你的独立站就能脱颖而出。</p>
      <h2>SEO 还是流量基石</h2>
      <p>Google SEO 是最稳定的长期流量来源。关键词研究、内容创作、外链建设三大核心缺一不可。</p>
      <h2>社交媒体引流</h2>
      <p>Twitter/X、LinkedIn、Reddit、TikTok 各有特点，找到你的目标用户聚集的平台重点突破。</p>
      <h2>付费广告入门</h2>
      <p>Google Ads、Facebook Ads 是最主流的付费渠道。从小预算开始测试，找到盈利的广告素材和受众。</p>
      <h2>邮件营销的价值</h2>
      <p>不要忽视邮件列表的价值。它是你完全拥有的用户触达渠道，转化率往往高于其他渠道。</p>
    `
  },
  {
    id: 4,
    title: '副业创业：从 0 到 1 的实用指南',
    excerpt: '想开展副业但不知道从何入手？分享从 idea 验证到产品落地的完整路径，帮你少走弯路。',
    category: '副业创业',
    date: '2026-07-03',
    readTime: '10 分钟',
    author: '作者',
    content: `
      <p>副业不是不务正业，而是给自己多一个选择，多一份抗风险能力。</p>
      <h2>找到你的方向</h2>
      <p>从你的技能、兴趣、市场需求三个维度交叉，找到最适合你的副业方向。</p>
      <h2>验证需求</h2>
      <p>不要一上来就花几个月做产品。先用最小成本验证需求，比如做个落地页收集意向。</p>
      <h2>快速交付</h2>
      <p>MVP（最小可行产品）思维很重要。先交付一个能用的版本，再根据用户反馈迭代。</p>
      <h2>时间管理</h2>
      <p>副业最大的挑战是时间。固定时间块、利用碎片时间、提高效率都是必修课。</p>
    `
  },
  {
    id: 5,
    title: '探索现代 Web 开发的未来趋势',
    excerpt: '从 WebAssembly 到边缘计算，Web 开发正在经历前所未有的变革。本文将带你了解 2026 年最值得关注的技术趋势。',
    category: '技术趋势',
    date: '2026-06-28',
    readTime: '8 分钟',
    author: '作者',
    content: `
      <p>Web 开发领域正在以前所未有的速度演进。随着 WebAssembly 的成熟、边缘计算的普及以及 AI 辅助开发的兴起，我们正站在一个新时代的起点。</p>
      <h2>WebAssembly：超越浏览器的边界</h2>
      <p>WebAssembly（Wasm）不再仅仅是浏览器中运行 C++ 代码的工具。如今，它已经成为云原生应用的重要组成部分。</p>
      <h2>边缘计算：更近用户，更快响应</h2>
      <p>边缘计算将计算能力带到离用户更近的地方，大幅降低了延迟。Cloudflare Workers、Vercel Edge Functions 等平台让开发者能够轻松部署边缘应用。</p>
      <h2>AI 辅助开发：人机协作的新范式</h2>
      <p>AI 编程助手已经从实验性工具变成了开发流程的标配。从代码生成到自动化测试，AI 正在重塑我们的工作方式。</p>
      <h2>结语</h2>
      <p>未来已来，只是分布不均。作为开发者，保持学习和好奇心，才能在这波浪潮中乘风破浪。</p>
    `
  },
  {
    id: 6,
    title: 'Vercel 部署实战：从 GitHub 到上线',
    excerpt: '详细讲解如何将你的项目通过 Vercel 部署上线，包括 CI/CD、自定义域名、环境变量等配置。',
    category: '建站实战',
    date: '2026-06-20',
    readTime: '9 分钟',
    author: '作者',
    content: `
      <p>Vercel 是前端开发者部署项目的首选平台之一，体验丝滑，功能强大。</p>
      <h2>为什么选择 Vercel？</h2>
      <p>自动部署、全球 CDN、边缘函数、预览功能，Vercel 为前端项目提供了开箱即用的最佳实践。</p>
      <h2>连接 GitHub 仓库</h2>
      <p>只需几步授权，Vercel 就能自动识别你的项目类型并配置构建命令。</p>
      <h2>自定义域名</h2>
      <p>绑定你自己的域名，Vercel 会自动配置 HTTPS 证书，全程无痛。</p>
      <h2>环境变量配置</h2>
      <p>敏感信息不要写在代码里，使用环境变量来管理，安全又灵活。</p>
    `
  }
];

// 从 localStorage 读取用户发布的文章并合并
function getPosts() {
  const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  const allPosts = [...savedPosts, ...defaultPosts];
  return allPosts.filter((post, index, self) =>
    index === self.findIndex(p => p.id === post.id)
  );
}

const posts = getPosts();

// 根据 ID 获取文章
function getPostById(id) {
  return posts.find(post => post.id === parseInt(id));
}

// 根据分类获取文章
function getPostsByCategory(category) {
  if (!category || category === '全部') return posts;
  return posts.filter(post => post.category === category);
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
  return posts.filter(post =>
    post.title.toLowerCase().includes(kw) ||
    post.excerpt.toLowerCase().includes(kw) ||
    post.category.toLowerCase().includes(kw) ||
    post.content.toLowerCase().includes(kw)
  );
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
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        post.category.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        post.content.toLowerCase().includes(searchKeyword.toLowerCase())
      );
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

    postsContainer.innerHTML = filteredPosts.map(post => {
      const title = searchKeyword ? highlightText(post.title, searchKeyword) : post.title;
      const excerpt = searchKeyword ? highlightText(post.excerpt, searchKeyword) : post.excerpt;
      return `
        <article class="post-card">
          <div class="post-card__body">
            <span class="post-card__category">${post.category}</span>
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

  document.title = `${post.title} - 个人博客`;

  postDetail.innerHTML = `
    <article class="post-content">
      <a href="index.html" class="btn-back">← 返回首页</a>
      <div class="post-content__header">
        <span class="post-content__category">${post.category}</span>
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
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHome();
  initPostDetail();
});
