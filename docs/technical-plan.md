# 儿童互动阅读软件｜技术方案

> 阶段：技术方案  
> 当前版本：v0.1  
> 当前状态：详细内容已确认  
> 写入规则：用户确认后，才允许写入 Git

---

## 1. 技术目标

### 1.1 第一版技术目标

第一版技术目标是实现一个轻量、可运行、可部署的儿童中文互动阅读 Web App MVP。

核心目标：

- 本地可以启动运行。
- 浏览器中可以完成完整阅读流程。
- 不依赖后端服务。
- 不依赖数据库。
- 不需要账号登录。
- 故事和题目数据内置在前端项目中。
- 学习进度保存在浏览器本地。
- 后续可以扩展音频、AI、家长端和后端服务。

### 1.2 第一版技术边界

第一版只做前端单页应用。

第一版做：

- Vite 前端工程
- React 页面组件
- TypeScript 类型约束
- CSS 样式
- 本地故事数据
- localStorage 学习进度
- 静态网页部署能力

第一版不做：

- 后端 API
- 数据库
- 账号系统
- 支付系统
- 服务端鉴权
- 儿童真实信息采集
- 真实语音识别
- 真实 AI 内容生成上线
- 后台 CMS

---

## 2. 技术栈选择

### 2.1 前端框架

第一版使用：

```text
Vite + React + TypeScript + CSS
```

选择原因：

| 技术 | 用途 | 原因 |
|---|---|---|
| Vite | 前端构建工具 | 启动快，配置轻，适合 MVP |
| React | UI 框架 | 组件化清晰，适合页面和状态拆分 |
| TypeScript | 类型系统 | 约束故事、题目、进度数据结构 |
| CSS | 样式 | 第一版避免复杂样式库，降低成本 |

### 2.2 暂不引入的技术

第一版暂不引入：

| 技术 | 暂不使用原因 |
|---|---|
| Next.js | 第一版不需要服务端渲染和后端路由 |
| Redux | 状态较少，React useState/useMemo 足够 |
| Tailwind CSS | 第一版用普通 CSS 更直观 |
| UI 组件库 | 儿童产品视觉需要自定义，组件库不是必须 |
| React Router | 页面数量少，可先用内部状态控制页面 |
| 数据库 | 第一版无后端，不需要数据库 |
| Firebase/Supabase | 第一版不做账号和云端同步 |

说明：

后续如果页面复杂度提高，可以再引入 React Router；如果需要云端同步，再考虑 Supabase、Firebase 或自建后端。

---

## 3. 前端架构

### 3.1 应用形态

第一版采用单页应用结构：

```text
一个 React App
内部通过状态控制当前页面
所有数据在前端本地加载
学习进度写入 localStorage
```

页面流转：

```text
home
→ story-list
→ story-detail
→ reader
→ quiz
→ result
```

### 3.2 页面状态设计

第一版不引入路由库，使用应用状态控制页面。

核心状态：

```ts
currentView: 'home' | 'story-list' | 'story-detail' | 'reader' | 'quiz' | 'result'
selectedStoryId: string | null
currentPageIndex: number
currentQuestionIndex: number
answers: Record<string, string>
lastResult: ResultState | null
progress: ProgressState
```

页面切换规则：

| 当前页面 | 操作 | 下一个页面 |
|---|---|---|
| home | 开始今日阅读 | story-detail |
| home | 查看全部故事 | story-list |
| story-list | 点击故事卡片 | story-detail |
| story-detail | 开始阅读 | reader |
| reader | 最后一页点击去答题 | quiz |
| quiz | 完成最后一题 | result |
| result | 返回首页 | home |
| result | 继续下一篇 | story-detail |

### 3.3 后续路由扩展

后续如果需要 URL 可分享、浏览器前进后退、页面直接访问，可以引入 React Router。

未来路由可以设计为：

```text
/
/stories
/stories/:storyId
/stories/:storyId/read
/stories/:storyId/quiz
/stories/:storyId/result
```

第一版先不做，避免增加开发复杂度。

---

## 4. 目录结构设计

### 4.1 第一版目录结构

建议目录结构：

```text
src/
  main.tsx
  App.tsx
  styles.css
  data/
    stories.ts
  types/
    story.ts
    progress.ts
  utils/
    progressStorage.ts
    reward.ts
  components/
    Header.tsx
    ProgressSummary.tsx
    StoryCard.tsx
    Stars.tsx
    PrimaryButton.tsx
  pages/
    HomePage.tsx
    StoryListPage.tsx
    StoryDetailPage.tsx
    ReaderPage.tsx
    QuizPage.tsx
    ResultPage.tsx
public/
  vite.svg
package.json
index.html
README.md
```

### 4.2 目录职责

| 目录/文件 | 职责 |
|---|---|
| `main.tsx` | React 应用入口 |
| `App.tsx` | 全局页面状态和页面切换 |
| `styles.css` | 全局样式 |
| `data/stories.ts` | 内置原创故事和题目 |
| `types/story.ts` | 故事、分页、题目类型 |
| `types/progress.ts` | 学习进度类型 |
| `utils/progressStorage.ts` | localStorage 读写 |
| `utils/reward.ts` | 星星和徽章计算 |
| `components/` | 可复用 UI 组件 |
| `pages/` | 页面级组件 |

---

## 5. 数据模型设计

### 5.1 故事类型

```ts
export type StoryLevel = 'L1' | 'L2' | 'L3'

export interface Story {
  id: string
  title: string
  level: StoryLevel
  ageRange: string
  theme: string
  summary: string
  coverEmoji: string
  estimatedMinutes: number
  keywords: string[]
  pages: StoryPage[]
  questions: Question[]
}

export interface StoryPage {
  id: string
  text: string
  keywords: string[]
}
```

### 5.2 题目类型

```ts
export type QuestionType = 'word' | 'comprehension' | 'judge'

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  options: string[]
  answer: string
  explanation: string
}
```

第一版题目规则：

- 每篇故事 3 道题。
- 第 1 题为识字题。
- 第 2、3 题为阅读理解题或判断题。
- 每题只有 1 个正确答案。
- 每题必须有解释文案。

### 5.3 进度类型

```ts
export interface ProgressState {
  completedStoryIds: string[]
  storyStars: Record<string, number>
  storyScores: Record<string, number>
  totalStars: number
  streakDays: number
  lastCompletedDate: string | null
  badges: string[]
}
```

### 5.4 答题结果类型

```ts
export interface ResultState {
  storyId: string
  correctCount: number
  totalQuestions: number
  stars: number
  earnedBadges: string[]
}
```

---

## 6. 本地存储设计

### 6.1 存储方式

第一版使用浏览器：

```text
localStorage
```

存储 key：

```text
child-reading-progress-v1
```

### 6.2 存储内容

保存内容：

```ts
{
  completedStoryIds: ['red-umbrella'],
  storyStars: {
    'red-umbrella': 3
  },
  storyScores: {
    'red-umbrella': 3
  },
  totalStars: 3,
  streakDays: 1,
  lastCompletedDate: '2026-05-03',
  badges: ['reading-sprout']
}
```

### 6.3 本地存储函数

需要实现：

```ts
loadProgress(): ProgressState
saveProgress(progress: ProgressState): void
completeStory(progress: ProgressState, result: ResultState): ProgressState
resetProgress(): ProgressState
```

### 6.4 异常处理

localStorage 异常处理：

- 如果没有历史数据，返回默认进度。
- 如果 JSON 解析失败，返回默认进度。
- 如果字段缺失，补默认值。
- 如果浏览器禁用 localStorage，页面仍可运行，但刷新后进度不保留。

### 6.5 隐私原则

第一版不上传任何儿童数据。

不保存：

- 真实姓名
- 手机号
- 照片
- 语音
- 地址
- 学校
- 班级
- 家长联系方式

---

## 7. 奖励计算设计

### 7.1 星星计算

```ts
function calculateStars(correctCount: number): number {
  if (correctCount >= 3) return 3
  if (correctCount === 2) return 2
  return 1
}
```

规则：

| 答题结果 | 星星 |
|---|---|
| 答对 0–1 题 | 1 颗 |
| 答对 2 题 | 2 颗 |
| 答对 3 题 | 3 颗 |

说明：

只要完成阅读和答题，就至少给 1 颗星，避免孩子受挫。

### 7.2 最高星星保存

同一篇故事重复完成时：

```text
保存最高星星数，不降低已有成绩。
```

示例：

```text
第一次：2 颗星
第二次：1 颗星
最终保存：2 颗星
```

### 7.3 徽章计算

第一版徽章：

| ID | 名称 | 条件 |
|---|---|---|
| reading-sprout | 阅读小苗 | 完成第 1 篇故事 |
| star-collector | 星星收集员 | 累计获得 10 颗星 |
| streak-reader | 坚持小达人 | 连续阅读 3 天 |
| story-explorer | 故事探险家 | 完成全部 5 篇故事 |

---

## 8. 组件拆分设计

### 8.1 页面组件

| 页面组件 | 职责 |
|---|---|
| `HomePage` | 首页，展示今日任务、总星星、连续天数 |
| `StoryListPage` | 故事列表，展示所有故事卡片 |
| `StoryDetailPage` | 故事详情，展示简介、重点字词和开始按钮 |
| `ReaderPage` | 阅读页，展示分页正文和翻页按钮 |
| `QuizPage` | 答题页，展示题目、选项和反馈 |
| `ResultPage` | 完成页，展示星星、答对数和下一步按钮 |

### 8.2 通用组件

| 通用组件 | 职责 |
|---|---|
| `Header` | 顶部标题和返回按钮 |
| `ProgressSummary` | 星星、连续天数、完成数量汇总 |
| `StoryCard` | 故事卡片 |
| `Stars` | 星星展示 |
| `PrimaryButton` | 统一主按钮 |
| `BadgeList` | 徽章展示，可后续添加 |

### 8.3 组件设计原则

- 页面组件负责业务流程。
- 通用组件只负责展示。
- 数据从 `App.tsx` 向下传递。
- 子组件通过回调触发页面切换或状态更新。
- 第一版避免过度抽象。

---

## 9. 样式与体验设计

### 9.1 样式原则

儿童阅读产品样式需要：

- 字体大
- 按钮大
- 色彩温和
- 页面留白充足
- 卡片圆角明显
- 避免密集文本
- 避免强刺激动画

### 9.2 基础视觉方向

第一版 CSS 方向：

```text
背景：浅暖色或浅蓝色
卡片：白色，圆角，轻阴影
主色：橙色、蓝色或绿色
文字：深灰，保证可读性
按钮：大圆角，高对比
```

### 9.3 响应式设计

第一版优先支持：

- 手机浏览器
- 平板浏览器
- 桌面浏览器基础适配

布局规则：

- 页面最大宽度控制在 960px 内。
- 移动端单列展示。
- 桌面端可以双列或三列展示故事卡片。
- 阅读正文在移动端也要足够大。

---

## 10. 内容数据设计

### 10.1 第一版内置故事

第一版内置 5 篇原创故事：

| ID | 标题 | 等级 | 主题 |
|---|---|---|---|
| red-umbrella | 小兔子的红雨伞 | L1 | 分享与帮助 |
| glowing-stone | 会发光的石头 | L1 | 好奇心 |
| bear-brush-teeth | 小熊不想刷牙 | L1 | 生活习惯 |
| cloud-postman | 云朵邮递员 | L2 | 想象力 |
| slow-forest-bus | 森林里的慢慢车 | L2 | 耐心与合作 |

### 10.2 内容文件位置

```text
src/data/stories.ts
```

该文件导出：

```ts
export const stories: Story[] = []
```

### 10.3 内容扩展方式

后续添加新故事时，只需：

- 在 `stories.ts` 中新增故事对象。
- 确保字段完整。
- 确保每篇 3 道题。
- 确保内容原创或授权。

---

## 11. 开发与运行方案

### 11.1 本地运行命令

```bash
npm install
npm run dev
```

### 11.2 构建命令

```bash
npm run build
```

### 11.3 预览命令

```bash
npm run preview
```

### 11.4 package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

---

## 12. 测试方案预留

第一版开发完成后需要测试：

| 测试项 | 验证内容 |
|---|---|
| 启动测试 | `npm install` 和 `npm run dev` 可运行 |
| 页面测试 | 首页、列表、详情、阅读、答题、完成页可访问 |
| 流程测试 | 完整流程可跑通 |
| 答题测试 | 正确和错误答案都有反馈 |
| 奖励测试 | 星星数量计算正确 |
| 进度测试 | 刷新后完成状态仍存在 |
| 数据测试 | 5 篇故事和题目字段完整 |
| 适配测试 | 手机和桌面基础可用 |

---

## 13. 部署方案预留

第一版是纯前端静态网页，可部署到：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

推荐优先：

```text
Vercel 或 GitHub Pages
```

原因：

- 适合静态前端项目。
- 部署成本低。
- MVP 演示方便。

---

## 14. 后续扩展路线

### 14.1 路由扩展

当页面需要 URL 和浏览器前进后退时，引入：

```text
React Router
```

### 14.2 家长端扩展

后续可新增：

```text
/parent
```

功能包括：

- 阅读记录
- 星星统计
- 完成故事列表
- 使用时长提醒
- 内容等级说明

### 14.3 后端扩展

如果后续需要账号和云端同步，可新增：

- 用户系统
- 故事内容 API
- 学习记录 API
- 家长报告 API
- 管理后台

但这不属于第一版。

### 14.4 AI 扩展

后续如果接入 AI，建议只用于：

- 家长定制故事草稿
- 内部辅助生成题目草稿
- 内容难度辅助分析

AI 内容上线前必须经过审核，不能直接面向儿童自动发布。

### 14.5 语音扩展

后续可扩展：

- 故事朗读音频
- 重点字词发音
- 跟读练习

第一版不做真实语音识别评分。

---

## 15. 技术方案结论

第一版技术路线：

```text
Vite + React + TypeScript + CSS
```

第一版应用形态：

```text
纯前端单页应用，无账号、无后端、无数据库。
```

第一版数据方案：

```text
故事和题目内置在 src/data/stories.ts，学习进度保存在 localStorage。
```

第一版开发重点：

```text
先跑通 首页 → 故事列表 → 故事详情 → 阅读 → 答题 → 完成 的 MVP 主流程。
```

完成本技术方案后，可以进入开发计划阶段。

---

## 变更记录

| 日期 | 版本 | 内容 | 状态 |
|---|---|---|---|
| 2026-05-03 | v0.1 | 创建技术方案，确认技术栈、架构、数据模型、本地存储、组件拆分和扩展路线 | 已确认并写入 Git |
