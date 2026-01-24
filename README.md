# 📝 Personal Blog (React)

## 📝 项目简介
一个基于 React + Vite 构建的轻量级个人博客管理系统。支持 Markdown 语法的文章创作、预览及本地存储，通过简洁的状态切换逻辑提供流畅的文章管理体验。

## ✨ 功能特性
- ✅ **Markdown 渲染**：集成 react-markdown，支持文章内容的实时解析与展示。
- ✅ **单页视图导航**：基于状态机理念实现列表页与编辑页的无缝切换。
- ✅ **数据持久化**：深度结合 LocalStorage，确保博客内容在页面刷新后依然安全。
- ✅ **文章管理**：支持一键发布文章、预览摘要以及带确认提醒的物理删除。

## 🛠️ 技术栈
- **框架**: React 18 (Hooks: useState, useEffect)
- **解析**: react-markdown
- **存储**: LocalStorage API
- **构建**: Vite

## 📸 项目预览

### 1.文章列表视图
展示所有已发布的博客文章，包含日期及内容摘要。
![初始界面](./screenshots/screenshot1.png)


![文章列表](./screenshots/screenshot2.png)

### 2.Markdown 编辑器
支持实时输入标题与 Markdown 格式的内容，一键发布。
![编辑器视图](./screenshots/screenshot3.png)

## 3.交互反馈机制
为了提升用户体验并防止误操作，项目内置了关键节点的交互反馈：
* **发布成功提示**：文章成功同步至本地存储后，弹出即时反馈，告知用户操作已完成。
![发布提醒] (./screenshots/screenshot4.jpg.png)
* **安全删除确认**：执行删除操作前触发二次确认弹窗，有效规避因误触导致的数据丢失。
![删除确认] (./screenshots/screenshot5.png)


## 🚀 本地运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动后访问：
http://localhost:5173

```

## 💡 项目亮点
- **状态驱动的架构设计**: 通过 `currentView` 核心状态控制组件生命周期，实现了轻量级的单页应用（SPA）逻辑，避免了引入复杂路由库带来的性能开销。
- **数据不可变更新**: 在发布新文章时使用 `setPosts([newPost, ...posts])`，严格遵循 React 状态不可变原则，确保了 UI 渲染的高效性与可预测性。
- **健壮的存储方案**: 在数据读取阶段对 JSON 解析进行了 `try...catch` 容错处理，并利用 `useEffect` 自动同步数据，实现了零维护成本的持久化层。
- **内容展示优化**: 利用 `content.slice(0, 100)` 实现了列表页的文章“自动摘要”功能，兼顾了展示的美观度与页面加载性能。