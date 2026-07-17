// ============================================
// 个人博客 - 数据与交互逻辑
// ============================================

// 默认文章数据
const defaultPosts = [
  {
    id: 1,
    title: '探索现代 Web 开发的未来趋势',
    excerpt: '从 WebAssembly 到边缘计算，Web 开发正在经历前所未有的变革。本文将带你了解 2026 年最值得关注的技术趋势。',
    category: '技术趋势',
    date: '2026-07-10',
    readTime: '8 分钟',
    author: '作者',
    content: `
      <p>Web 开发领域正在以前所未有的速度演进。随着 WebAssembly 的成熟、边缘计算的普及以及 AI 辅助开发的兴起，我们正站在一个新时代的起点。</p>
      <h2>WebAssembly：超越浏览器的边界</h2>
      <p>WebAssembly（Wasm）不再仅仅是浏览器中运行 C++ 代码的工具。如今，它已经成为云原生应用的重要组成部分，被用于 serverless 函数、插件系统等领域。</p>
      <h2>边缘计算：更近用户，更快响应</h2>
      <p>边缘计算将计算能力带到离用户更近的地方，大幅降低了延迟。Cloudflare Workers、Vercel Edge Functions 等平台让开发者能够轻松部署边缘应用。</p>
      <h2>AI 辅助开发：人机协作的新范式</h2>
      <p>AI 编程助手已经从实验性工具变成了开发流程的标配。从代码生成到自动化测试，AI 正在重塑我们的工作方式。</p>
      <h2>结语</h2>
      <p>未来已来，只是分布不均。作为开发者，保持学习和好奇心，才能在这波浪潮中乘风破浪。</p>
    `
  },
  {
    id: 2,
    title: 'CSS Grid 布局完全指南',
    excerpt: 'CSS Grid 是现代 Web 布局的强大工具。本文从基础概念到高级技巧，全面解析如何用好 Grid 布局。',
    category: '前端开发',
    date: '2026-07-05',
    readTime: '12 分钟',
    author: '作者',
    content: `
      <p>CSS Grid 布局是 CSS 中第一个真正意义上的二维布局系统，它让我们能够同时控制行和列。</p>
      <h2>什么是 CSS Grid？</h2>
      <p>Grid 布局允许我们将一个容器划分为行和列，然后将子元素放置到这些网格单元中。与 Flexbox 不同，Grid 专门为二维布局设计。</p>
      <h2>基础概念</h2>
      <p>使用 <code>display: grid</code> 创建一个网格容器。通过 <code>grid-template-columns</code> 和 <code>grid-template-rows</code> 定义网格结构。</p>
      <h2>实战技巧</h2>
      <p>使用 <code>fr</code> 单位实现弹性布局，<code>minmax()</code> 函数控制尺寸范围，<code>auto-fit</code> 和 <code>auto-fill</code> 实现响应式网格。</p>
      <h2>总结</h2>
      <p>CSS Grid 是现代 Web 开发必备的技能。掌握它，你将能够更高效地构建复杂的响应式布局。</p>
    `
  },
  {
    id: 3,
    title: 'JavaScript 异步编程深入理解',
    excerpt: '从回调到 Promise，再到 async/await，JavaScript 的异步编程模式不断演进。本文带你深入理解每种模式。',
    category: '前端开发',
    date: '2026-06-28',
    readTime: '15 分钟',
    author: '作者',
    content: `
      <p>JavaScript 是单线程语言，异步编程是其核心特性之一。理解异步模式对每个前端开发者都至关重要。</p>
      <h2>回调函数时代</h2>
      <p>回调是最早的异步处理方式，但容易导致"回调地狱"，代码难以维护。</p>
      <h2>Promise 的革命</h2>
      <p>Promise 通过链式调用解决了回调地狱问题，提供了更清晰的异步流程控制。</p>
      <h2>async/await 的优雅</h2>
      <p>async/await 让异步代码看起来像同步代码，大大提升了可读性和可维护性。</p>
      <h2>最佳实践</h2>
      <p>合理使用 <code>Promise.all</code>、<code>Promise.race</code> 等方法处理并发场景，注意错误处理和资源释放。</p>
    `
  },
  {
    id: 4,
    title: '设计简洁高效的用户界面',
    excerpt: '好的 UI 设计不在于花哨的效果，而在于清晰的层次和流畅的交互。分享几个实用的设计原则。',
    category: '设计思考',
    date: '2026-06-20',
    readTime: '6 分钟',
    author: '作者',
    content: `
      <p>简洁不等于简单。真正的简洁设计需要深思熟虑，去除多余，保留本质。</p>
      <h2>视觉层次</h2>
      <p>通过大小、颜色、间距建立清晰的视觉层次，引导用户注意力。</p>
      <h2>留白的力量</h2>
      <p>留白不是浪费空间，而是让内容呼吸，提升可读性和专注度。</p>
      <h2>一致性原则</h2>
      <p>保持字体、颜色、间距、交互的一致性，降低用户认知成本。</p>
      <h2>反馈即时性</h2>
      <p>每个操作都应有即时反馈，让用户知道系统正在响应。</p>
    `
  },
  {
    id: 5,
    title: 'Git 工作流最佳实践',
    excerpt: '团队协作中，Git 工作流的选择至关重要。对比分析 Git Flow、GitHub Flow 等主流工作流。',
    category: '工具使用',
    date: '2026-06-15',
    readTime: '10 分钟',
    author: '作者',
    content: `
      <p>版本控制是团队协作的基础，选择合适的 Git 工作流能大幅提升开发效率。</p>
      <h2>Git Flow</h2>
      <p>经典的多分支模型，适合有明确发布周期的项目，但相对复杂。</p>
      <h2>GitHub Flow</h2>
      <p>轻量级工作流，只有 main 和 feature 分支，适合持续部署。</p>
      <h2>提交规范</h2>
      <p>使用 Conventional Commits 规范提交信息，便于生成 changelog 和自动化处理。</p>
      <h2>团队约定</h2>
      <p>无论选择哪种工作流，最重要的是团队达成一致并严格执行。</p>
    `
  },
  {
    id: 6,
    title: '性能优化：从首屏加载说起',
    excerpt: '网站性能直接影响用户体验和转化率。本文分享几个关键的性能优化策略。',
    category: '性能优化',
    date: '2026-06-08',
    readTime: '11 分钟',
    author: '作者',
    content: `
      <p>性能优化是一个系统工程，涉及网络、渲染、资源加载等多个方面。</p>
      <h2>关键指标</h2>
      <p>关注 LCP、FID、CLS 等 Core Web Vitals 指标，它们直接影响搜索排名。</p>
      <h2>资源优化</h2>
      <p>压缩图片、延迟加载、代码分割、Tree Shaking 等技术能有效减少加载体积。</p>
      <h2>渲染优化</h2>
      <p>减少重排重绘，使用 CSS transforms 和 opacity 做动画，合理使用虚拟列表。</p>
      <h2>缓存策略</h2>
      <p>利用 HTTP 缓存、Service Worker、CDN 等多层缓存提升重复访问速度。</p>
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

// 获取所有分类
function getCategories() {
  const categories = new Set();
  posts.forEach(post => categories.add(post.category));
  return Array.from(categories);
}

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
    const categories = ['全部', ...getCategories()];
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
