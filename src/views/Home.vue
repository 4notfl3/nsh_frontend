<!--
  首页：逆水寒攻略组
  主题展示 + 快捷入口卡片
-->
<template>
  <div class="home">
    <!-- 主题区域 -->
    <section class="hero">
      <div class="hero-badge">数据驱动 · 策略至上</div>
      <h1 class="hero-title">逆水寒攻略组</h1>
      <p class="hero-desc">
        专注于逆水寒帮会战数据可视化分析，<br>
        为团队提供清晰的战力对比与战术参考。
      </p>
    </section>

    <!-- 快捷入口卡片 -->
    <section class="quick-links">
      <router-link to="/guild" class="link-card lift-on-hover">
        <span class="link-icon">🏠</span>
        <h3>帮会</h3>
        <p>帮会管理、成员列表、战绩归档</p>
      </router-link>

      <router-link to="/tools" class="link-card lift-on-hover">
        <span class="link-icon">🔧</span>
        <h3>工具</h3>
        <p>数据可视化、队伍编排等实用工具</p>
      </router-link>

      <!-- 预留更多模块入口 -->
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 960px; margin: 0 auto; padding: 60px 24px 80px;
}

/* --- 主题区域 --- */
.hero {
  text-align: center; margin-bottom: 56px;
}
.hero-badge {
  display: inline-block;
  padding: 6px 18px; border-radius: 100px;
  background: rgba(139,94,60,0.08); color: var(--color-accent);
  font-size: 13px; font-weight: 500; margin-bottom: 20px;
}
.hero-title {
  font-size: 40px; font-weight: 800; letter-spacing: 2px;
  color: var(--color-text); margin-bottom: 16px;
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-smooth);
  cursor: pointer;
}
.link-card:hover {
  border-color: var(--color-accent-light);
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}
.link-icon { font-size: 36px; display: block; margin-bottom: 14px; }
.link-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.link-card p { color: var(--color-text-muted); font-size: 14px; line-height: 1.6; }

@media (max-width: 640px) {
  .home { padding: 40px 16px 60px; }
  .hero-title { font-size: 28px; }
}
</style>
