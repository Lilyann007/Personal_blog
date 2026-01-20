# Personal Blog（React）

一个使用 React + Vite 构建的个人博客项目，支持文章的创建、查看与删除。
本项目最初版本功能较多，在重构过程中对功能与结构进行了简化。

---

## 项目功能

- 文章列表展示
- 新建文章（标题+内容）
- 删除文章（带确认提示）
- Markdown 内容渲染
- 基于 LocalStorage 的数据持久化
- 单页视图切换（无需刷新）

---

## 技术栈

- **React**
  - 函数组件
  - Hooks（useState / useEffect）
- **Vite**
- **JavaScript (ES6+)**
- **react-markdown**
- **CSS**

---

##核心实现说明

### 1.状态管理设计

项目使用 React Hooks 在组件内部管理状态，主要包括：

- `posts`：博客文章列表
- `currentView`：当前视图状态（list / edit）
- `editingPost`：正在编辑的文章内容
- `loading` / `error`：预留的异步与异常状态

通过显式的状态划分，保证视图切换与数据更新逻辑清晰可追踪。

---

### 2.本地数据持久化

文章数据通过 `localStorage` 进行存储，并结合 `useEffect` 实现自动同步：

- 首次加载时从 `localStorage` 读取数据
- 每次文章列表更新时自动写入

在读取阶段加入 `try / catch`，避免数据损坏导致应用崩溃。

---

### 3.视图切换策略

通过 `currentView` 状态进行条件渲染：

- `list`：文章列表视图
- `edit`：文章编辑视图


---

## 本地运行

```bash
npm install
npm run dev

#启动后访问：
http://localhost:5173
