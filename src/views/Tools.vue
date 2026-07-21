<!--
  工具页面 —— 数据可视化入口
  跳转到 /tools/viz 使用具体工具
-->
<template>
  <div class="page-placeholder">
    <div class="placeholder-icon">🔧</div>
    <h2>工具</h2>
    <p>实用工具集合</p>

    <!-- 工具列表 -->
    <div class="tool-list">
      <router-link to="/tools/viz" class="tool-card lift-on-hover">
        <span class="tool-icon">📊</span>
        <div>
          <h4>数据可视化</h4>
          <span class="tool-desc">上传 CSV 分析帮战数据</span>
        </div>
      </router-link>
      <!-- 后续在此添加更多工具入口 -->
    </div>
  </div>
</template>

<style scoped>
.page-placeholder {
  max-width: 700px; margin: 60px auto;
  padding: 40px 24px; text-align: center;
  animation: fadeSlideIn 0.5s ease both;
}
.placeholder-icon { font-size: 56px; margin-bottom: 16px; }
.page-placeholder h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.page-placeholder > p { color: var(--color-text-muted); font-size: 15px; margin-bottom: 32px; }

.tool-list { display: flex; flex-direction: column; gap: 12px; text-align: left; }
.tool-card {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-smooth);
}
.tool-card:hover { border-color: var(--color-accent-light); }
.tool-icon { font-size: 32px; flex-shrink: 0; }
.tool-card h4 { font-size: 16px; margin-bottom: 4px; }
.tool-desc { color: var(--color-text-muted); font-size: 13px; }

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
