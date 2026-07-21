<!--
  全局底部栏
  极简设计，仅展示基本信息
-->
<template>
  <footer class="footer">
    <div class="footer-inner">
      <span class="footer-text">逆水寒攻略组 · 数据可视化工具</span>
      <span class="footer-divider">|</span>
      <span class="footer-text">仅供游戏内玩家交流参考</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: 20px 32px;
  margin-top: auto;
}
.footer-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; gap: 12px;
  justify-content: center;
  color: var(--color-text-muted); font-size: 13px;
}
.footer-divider { color: var(--color-border); }
@media (max-width: 640px) {
  .footer-inner { flex-direction: column; gap: 4px; }
}
</style>
