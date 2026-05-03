function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-badge">MVP 原型</div>
        <h1>儿童互动阅读</h1>
        <p className="hero-text">
          一个面向 6–8 岁儿童的中文互动阅读与认字训练 Web App。
        </p>
        <div className="status-grid" aria-label="项目状态">
          <div className="status-card">
            <strong>5 篇</strong>
            <span>原创短故事</span>
          </div>
          <div className="status-card">
            <strong>3 题</strong>
            <span>每篇练习</span>
          </div>
          <div className="status-card">
            <strong>本地</strong>
            <span>保存进度</span>
          </div>
        </div>
        <p className="next-step">
          项目结构已初始化，下一步进入 MVP 功能实现。
        </p>
      </section>
    </main>
  )
}

export default App
