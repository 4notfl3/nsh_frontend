<!--
  首页：逆水寒攻略组
  主题展示 + 快捷入口卡片
-->
<template>
  <div class="home">
    <!-- 主题区域 -->
    <section class="hero">
      <h1 class="hero-title">逆水寒攻略组</h1>
      <p class="hero-desc">
        专注于逆水寒帮会战数据可视化分析，<br>
        为团队提供清晰的战力对比与战术参考。
      </p>
    </section>

    <!-- 快捷入口卡片 -->
    <section class="quick-links">
      <router-link to="/guild" class="link-card lift-on-hover">
        <h3>帮会</h3>
        <p>帮会展示</p>
      </router-link>

      <router-link to="/tools" class="link-card lift-on-hover">
        <h3>工具</h3>
        <p>数据可视化、队伍编排等实用工具</p>
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 960px; margin: 0 auto; padding: 60px 24px 80px;
  position: relative; z-index: 1;
}

/* --- 主题区域 --- */
.hero {
  text-align: center; margin-bottom: 56px;
}

.hero-title {
  font-size: 40px; font-weight: 800; letter-spacing: 4px;
  color: var(--color-text); margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
.hero-desc {
  color: var(--color-text-muted); font-size: 16px; line-height: 1.8;
}

/* --- 快捷入口卡片 --- */
.quick-links {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}
.link-card {
  display: block; padding: 32px 28px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  transition: all var(--transition-smooth);
  cursor: pointer;
  backdrop-filter: blur(4px);
  text-decoration: none;
}
.link-card:hover {
  border-color: rgba(201,168,124,0.3);
  background: rgba(255,255,255,0.06);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  transform: translateY(-4px);
}
.link-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--color-text); }
.link-card p { color: var(--color-text-muted); font-size: 14px; line-height: 1.6; }

@media (max-width: 640px) {
  .home { padding: 40px 16px 60px; }
  .hero-title { font-size: 28px; }
}
</style>
