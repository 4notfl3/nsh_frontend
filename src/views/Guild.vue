<!--
  帮会页面（占位）
  后续扩展：帮会成员管理、战绩归档、活动记录等
-->
<template>
  <div class="page-placeholder">
    <div class="placeholder-icon">🏠</div>
    <h2>帮会</h2>
    <p>帮会管理模块开发中，敬请期待…</p>
    <p class="sub">将提供：成员列表、战绩归档、帮战数据对比</p>
  </div>
</template>

<style scoped>
.page-placeholder {
  max-width: 600px; margin: 80px auto;
  text-align: center; padding: 60px 24px;
  animation: fadeSlideIn 0.5s ease both;
}
.placeholder-icon { font-size: 64px; margin-bottom: 20px; }
.page-placeholder h2 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
.page-placeholder p { color: var(--color-text-muted); font-size: 15px; }
.sub { margin-top: 8px; font-size: 13px !important; color: #bbb !important; }
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
