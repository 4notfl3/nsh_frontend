<!--
  全局底部栏
  半透明毛玻璃，与 Header 风格统一
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
  position: relative;
  z-index: 1;
  opacity: 0.9;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255,255,255,0.05);
  padding: 20px 32px;
}
.footer-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; gap: 12px;
  justify-content: center;
  color: rgba(255,255,255,0.35); font-size: 13px;
}
.footer-divider { color: rgba(255,255,255,0.1); }
@media (max-width: 640px) {
  .footer-inner { flex-direction: column; gap: 4px; }
}
</style>
