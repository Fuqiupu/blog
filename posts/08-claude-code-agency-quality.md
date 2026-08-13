# 用 Claude Code 做出“Agency 级”网站：真正关键的不是 Prompt，而是设计约束

> 来源：X Article — *Build Agency-Quality $10K Websites With Claude Code*  
> 原帖：https://x.com/bateshkaaa/status/2079218516150862086?s=20

## 一句话总结

这篇文章真正有价值的地方，不是“Claude Code 可以一个下午做出价值 1 万美元的网站”，而是它提出了一套更正确的 AI 前端工作流：

**参考采集 → 建立设计语言 → 明确业务目标 → Claude Code 实现 → 浏览器检查 → 人工审美迭代。**

核心思想可以概括为：

> **不要让 Claude 自己设计网站，而要让 Claude 执行已经定义好的设计语言。**

---

# 1. 为什么 Claude Code 经常做出“AI 模板感”网站

如果只给 Claude 这样的指令：

> 做一个高级、现代、像 Shopify Editions 一样的网站。

看起来要求很多，实际上约束非常少。

“高级”“现代”“有设计感”这些词没有明确的视觉标准。

Claude 不知道：

- 字体应该多大；
- 页面留白应该多少；
- 内容应该居中还是非对称；
- 图片应该如何裁切；
- 动画应该多快；
- 页面是否允许突破常规容器；
- 哪些常见布局绝对不能出现。

在缺少明确约束时，AI 往往会选择最安全、最常见的网页结构：

```text
Hero
↓
Features
↓
3 个 Card
↓
About
↓
4 个 Card
↓
CTA
```

最后就会变成非常典型的：

**SaaS 模板 / AI Demo / 卡片式布局。**

问题不一定在模型，而在于缺少完整的设计系统。

---

# 2. 文章真正推荐的工作流

## Step 1：先加载“Design Brain”

不要一上来就让 Claude 写代码。

先建立一套设计规则。

也就是告诉 Claude：

**这个网站应该遵守什么设计语言。**

例如：

```text
Typography
Layout
Spacing
Motion
Imagery
Color
Navigation
Interaction
Do / Don't
```

这一步实际上是在建立：

```text
DESIGN_SYSTEM.md
```

之后所有页面都围绕这个文件执行。

---

# 3. 不要直接复制参考网站，要提取“设计方向”

第二步是寻找优秀网站作为参考。

例如：

- Shopify Editions
- Awwwards 网站
- 高端时装品牌官网
- Creative agency 官网
- Editorial 网站

但目的不是：

> 把这个网站复制出来。

而是分析：

> 为什么这个网站看起来高级？

需要拆解：

### Typography

- 标题字号
- 字重
- 行高
- 字距
- Serif / Sans Serif
- 大标题和正文的比例

### Layout

- 是否使用传统 container
- 是否非对称
- 是否大量留白
- 图片是否突破屏幕边界
- 页面是否有空间层级

### Imagery

- 图片尺寸
- 裁切方式
- 图片密度
- 是否使用微距
- 是否使用大面积视觉

### Motion

- Scroll animation
- Parallax
- Horizontal scroll
- Scale
- Reveal
- Mask
- Clip-path
- 3D transformation

### Interaction

- Hover
- Cursor
- Page transition
- Section transition
- Scroll-driven interaction

最终得到的不是“复制版网站”，而是一套：

**Visual Direction。**

---

# 4. Prompt 不应该只有视觉要求

真正开始制作网站前，还需要明确业务信息。

至少包括：

## Audience

网站给谁看？

例如服装工厂：

```text
Independent fashion brands
Streetwear startups
Boutique clothing brands
Small overseas fashion labels
```

## Primary Action

用户进入网站后，最希望他们做什么？

例如：

```text
Request a quote
Contact us
Send a tech pack
Book a consultation
```

一个网站最好有明确的主要目标。

否则 Claude 很容易为了“看起来丰富”加入大量没有意义的内容。

---

# 5. 第一版网站只是 V1，不是成品

Claude Code 最大的优势之一是：

**迭代速度非常快。**

所以正确流程不是：

```text
Prompt
↓
生成
↓
完成
```

而应该是：

```text
Prompt
↓
V1
↓
浏览器查看
↓
找问题
↓
修改
↓
V2
↓
再次查看
↓
继续修改
```

重点检查：

- 页面节奏；
- 字体比例；
- 图片位置；
- 动画速度；
- section transition；
- 手机端；
- 空白区域；
- 是否出现 AI 模板感；
- 是否存在无意义卡片。

真正的高级网站通常来自多轮修改，而不是第一次生成。

---

# 6. “Agency Quality”的关键其实是约束

文章最值得记住的一点：

> **高级感来自约束，而不是来自 AI 的自由发挥。**

如果告诉 AI：

> Be creative.

通常效果反而一般。

更有效的是告诉它：

```text
DO

- asymmetric layouts
- oversized typography
- editorial composition
- large image crops
- cinematic transitions
- strong whitespace
- scroll-driven interaction

DON'T

- SaaS cards
- 3-column feature grids
- purple gradients
- gradient blobs
- pill navigation
- generic dashboards
- icon + title + paragraph cards
- excessive rounded corners
```

**“禁止什么”往往和“应该做什么”一样重要。**

---

# 7. 一个比较实用的 DESIGN_SYSTEM.md 示例

以后制作视觉型网站，可以先建立这样的文件。

```markdown
# DESIGN SYSTEM

## Visual Direction

Cinematic editorial fashion website.

Reference:

- Shopify Editions
- Fashion editorials
- Modern creative agencies

Avoid traditional SaaS aesthetics.

---

## Typography

Hero:

80–120px

Section title:

48–72px

Body:

16–18px

Hero line-height:

0.9–1.05

Body max-width:

620px

Use oversized typography as a visual element.

---

## Layout

Prefer:

- asymmetric layouts
- overlapping content
- full viewport sections
- large whitespace
- images breaking containers

Avoid:

- centered card grids
- repetitive sections
- traditional Bootstrap layouts

---

## Motion

Prefer:

- scroll-driven animation
- slow cinematic movement
- parallax
- reveal masks
- scale transitions
- horizontal scroll

Animation duration:

800–1400ms

Avoid:

- bounce
- excessive fade-up
- unnecessary micro animations

---

## Imagery

Use:

- factory close-ups
- fabric texture
- sewing machines
- hands working
- garment details
- cinematic crops

Avoid:

- generic stock photography
- overly clean corporate photos

---

## Never Use

- purple gradient
- gradient blobs
- SaaS cards
- dashboard UI
- pill navigation
- 3-column icon cards
```

这个文件的作用，就是把“高级”变成 Claude 能执行的规则。

---

# 8. Claude Code 最适合做什么

Claude Code 非常适合负责：

```text
Design System
↓
React / HTML / CSS
↓
GSAP / Framer Motion
↓
Three.js
↓
Responsive
↓
Browser Debug
↓
Iteration
```

比如：

- 把视觉规则转换成 CSS；
- 根据截图还原布局；
- 写 Framer Motion；
- 写 GSAP ScrollTrigger；
- 写 Three.js 场景；
- 调整响应式；
- 修复 console error；
- 修改 DOM；
- 根据浏览器效果继续迭代。

这些都是 AI 非常擅长的事情。

---

# 9. 人仍然需要负责什么

AI 可以提高实现速度，但目前很难完全替代人的审美判断。

人主要负责：

## 参考选择

决定哪些网站值得参考。

## Art Direction

决定：

> 我们到底想要什么感觉？

## 审美判断

判断：

> 这个页面到底好不好看？

## 删除

这是非常重要的一步。

AI 很喜欢：

> 加东西。

高级设计很多时候却来自：

> 删东西。

例如删除：

- 多余 Card；
- 多余按钮；
- 多余文字；
- 多余动画；
- 多余 section。

---

# 10. 关于“$10K 网站一个下午”

这句话更多是营销表达。

Claude Code 确实可以大幅减少：

- 前端开发时间；
- CSS 调整；
- 动画实现；
- 响应式开发；
- debugging；
- 页面迭代时间。

但真正价值 \$10K 的 agency 项目通常还包括：

- Branding
- Strategy
- Copywriting
- UX
- Art Direction
- Photography
- SEO
- QA
- Client Communication
- Deployment
- Maintenance

所以更准确的理解是：

> **以前需要设计师 + 前端几天才能完成的高质量 Marketing Site，现在一个有审美、懂设计方向、会使用 AI 的人，有可能在一天内完成一个非常成熟的第一版。**

---

# 11. 推荐的 Claude Code 前端工作流

以后做网站可以直接按照这个流程。

```text
01 Inspiration
↓
02 Screenshot Collection
↓
03 Visual Analysis
↓
04 DESIGN_SYSTEM.md
↓
05 Website Brief
↓
06 Build V1
↓
07 Browser Review
↓
08 Remove Generic AI Patterns
↓
09 Motion Pass
↓
10 Responsive Pass
↓
11 Polish
↓
12 Final
```

其中最重要的是前四步：

```text
参考
↓
分析
↓
设计语言
↓
约束
```

而不是：

```text
直接让 AI 写代码
```

---

# 12. 最终结论

这篇文章真正值得学习的不是：

> Claude Code 很厉害。

而是：

> **AI 前端正在从“Prompt Engineering”进入“Art Direction + System Engineering”。**

未来真正能做出好网站的人，不一定是 CSS 写得最快的人。

更可能是能够：

```text
找到优秀参考
↓
理解为什么它优秀
↓
把视觉语言变成规则
↓
让 AI 执行规则
↓
判断结果是否正确
↓
不断迭代
```

的人。

最终：

**AI 负责实现。**

**人负责方向。**

---

## 我的记忆点

以后不要再写：

> 帮我做一个高级、现代、有设计感的网站。

而应该先完成：

```text
REFERENCE
↓
DESIGN DIRECTION
↓
DESIGN SYSTEM
↓
BUSINESS GOAL
↓
IMPLEMENTATION
```

这是从“AI Demo”走向真正高质量网站最重要的一步。
