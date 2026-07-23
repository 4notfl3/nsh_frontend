<template>
  <div class="stage">
    <!-- ========== 图片轮播背景 ==========
      把图片文件放进项目根目录的 public/img/ 目录（不是 src/assets），
      比如 public/img/师姐1.jpg，数组里就写 '/img/师姐1.jpg'。
      想要几张图循环就填几个，慢慢淡入淡出切换，不占用视频那么大的内存。
    -->
    <div class="bg-slideshow">
      <div
        v-for="(img, i) in bgImages"
        :key="img"
        class="bg-slide"
        :class="{ active: i === currentBg }"
        :style="{ backgroundImage: `url(${img})` }"
      ></div>
    </div>

    <!-- 水墨蒙层，压暗背景图、保证文字可读 -->
    <div class="ink-overlay"></div>

    <!-- 左上角标题图片 -->
    <img src="/img/主题.webp" alt="标题" class="logo">

    <!-- 顶部居中主标题 -->
    <div class="brand">
      <h1 class="brand-title">新世界</h1>
    </div>

    <!-- 居中登录弹窗 -->
    <div class="dialog">
      <div class="tabs">
        <span :class="{ on: !isRegister }" @click="switchMode(false)">登录</span>
        <span :class="{ on: isRegister }" @click="switchMode(true)">注册</span>
      </div>

      <transition name="tip">
        <p v-if="errorMsg" class="tip err">{{ errorMsg }}</p>
        <p v-else-if="successMsg" class="tip ok">{{ successMsg }}</p>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="!isRegister" key="login" class="fields">
          <input v-model="username" placeholder="账号" autocomplete="off" @input="clearMsg">
          <input v-model="password" type="password" placeholder="密码" autocomplete="new-password"
                 @keyup.enter="handleLogin" @input="clearMsg">
        </div>
        <div v-else key="register" class="fields">
          <input v-model="regUsername" placeholder="账号" autocomplete="off" @input="clearMsg">
          <input v-model="regPassword" type="password" placeholder="密码" autocomplete="new-password" @input="clearMsg">
          <input v-model="regPasswordConfirm" type="password" placeholder="确认密码" autocomplete="new-password"
                 @keyup.enter="handleRegister" @input="clearMsg">
        </div>
      </transition>

      <button v-if="!isRegister" class="cta" :disabled="loading" @click="handleLogin">
        <span>{{ loading ? '登录中...' : '登录' }}</span>
      </button>
      <button v-else class="cta" :disabled="loading" @click="handleRegister">
        <span>{{ loading ? '注册中...' : '注册' }}</span>
      </button>

      <p v-if="!isRegister" class="guest" :class="{ disabled: loading }" @click="!loading && goToHome()">
        游客登录
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/store/modules/user'

export default {
  created() {
    // 页面刷新后，若本地已存有token，恢复到axios默认请求头，避免凭证丢失
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  },
  data() {
    return {
      isRegister: false,
      username: '',
      password: '',
      regUsername: '',
      regPassword: '',
      regPasswordConfirm: '',
      loading: false,
      errorMsg: '',
      successMsg: '',

      // 把图片文件放进 public/img/ 目录（不是 src/assets），比如：
      // public/img/师姐1.jpg → 数组里写 '/img/师姐1.jpg'
      bgImages: [
        '/img/师姐1.jpg',
        '/img/阿初1.jpg',
        '/img/侯爷.jpg',
        '/img/姬蜜儿.jpg',
        '/img/师姐2.jpg',
        '/img/师姐3.jpg',
        '/img/师兄1.jpg',
        '/img/月牙儿.jpg',
        '/img/花将离.jpg'
        // 继续往下加 '/img/xxx.jpg' ...
      ],
      currentBg: 0,
      bgTimer: null
    }
  },
  mounted() {
    this.startSlideshow()
  },
  beforeUnmount() {
    clearInterval(this.bgTimer)
  },
  methods: {
    // 每隔一段时间切到下一张图，配合CSS的opacity过渡做慢速淡入淡出
    startSlideshow() {
      if (this.bgImages.length <= 1) return
      this.bgTimer = setInterval(() => {
        this.currentBg = (this.currentBg + 1) % this.bgImages.length
      }, 6000) // 每张图停留6秒，再加CSS里3秒的淡入淡出过渡
    },

    clearMsg() {
      this.errorMsg = ''
      this.successMsg = ''
    },

    switchMode(toRegister) {
      if (this.loading) return
      this.isRegister = toRegister
      this.clearMsg()
    },

    // ---------- 登录 ----------
    async handleLogin() {
      if (!this.username || !this.password) {
        this.errorMsg = '请输入账户和密码'
        return
      }

      this.loading = true
      this.clearMsg()

      try {
        const response = await axios.post('http://localhost:8080/api/login', {
          username: this.username,
          password: this.password
        })

        const res = response.data

        if (res.code === 200) {
          const token = res.data.token
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(res.data.userInfo))

          // 同步登录态到 Pinia store
          useUserStore().login(token, res.data.userInfo)

          // 将 token 写入 axios 默认请求头，后续所有请求自动携带该凭证
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          this.$router.replace('/home')
        } else {
          this.errorMsg = res.message || '登录失败'
        }
      } catch (error) {
        this.errorMsg = this.parseError(error)
        this.password = ''
      } finally {
        this.loading = false
      }
    },

    // ---------- 注册 ----------
    async handleRegister() {
      if (!this.regUsername || !this.regPassword || !this.regPasswordConfirm) {
        this.errorMsg = '请填写完整的注册信息'
        return
      }
      if (this.regPassword.length < 6) {
        this.errorMsg = '密码长度不能少于6位'
        return
      }
      if (this.regPassword !== this.regPasswordConfirm) {
        this.errorMsg = '两次输入的密码不一致'
        return
      }

      this.loading = true
      this.clearMsg()

      try {
        const response = await axios.post('http://127.0.0.1:8080/api/register', {
          username: this.regUsername,
          password: this.regPassword
        })

        const res = response.data

        if (res.code === 200) {
          this.successMsg = '注册成功，请登录'
          this.username = this.regUsername
          this.password = ''
          this.regUsername = ''
          this.regPassword = ''
          this.regPasswordConfirm = ''
          setTimeout(() => { this.isRegister = false }, 800)
        } else {
          this.errorMsg = res.message || '注册失败'
        }
      } catch (error) {
        this.errorMsg = this.parseError(error)
      } finally {
        this.loading = false
      }
    },

    parseError(error) {
      if (error.code === 'ERR_NETWORK') {
        return '无法连接后端服务，请检查 Spring Boot 是否启动 (端口8080)'
      } else if (error.response) {
        return error.response.data?.message || '请求失败'
      }
      return '操作异常，请稍后重试'
    },

    // ---------- 游客登录 ----------
    async goToHome() {
      this.loading = true
      this.clearMsg()

      try {
        const response = await axios.post('http://localhost:8080/api/guest-login')
        const res = response.data

        if (res.code === 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.userInfo))
          useUserStore().login(res.data.token, res.data.userInfo)
          this.$router.replace('/home')
        } else {
          this.errorMsg = res.message || '游客登录失败'
        }
      } catch (error) {
        this.errorMsg = this.parseError(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.stage {
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: "STKaiti", "KaiTi", "Songti SC", serif;
  background: #0b0b0b;
}

.bg-slideshow {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 3s ease; /* 慢速淡入淡出，改这个数值调切换速度 */
}

.bg-slide.active {
  opacity: 1;
}

/* 水墨蒙层：黑白渐变压暗，保证文字/表单可读性 */
.ink-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 40%, rgba(0, 0, 0, 0.6) 100%);
}

/* 左上角标题图片 */
.logo {
  position: absolute;
  z-index: 3;
  top: 32px;
  left: 40px;
  max-width: 220px;
  height: auto;
}

/* 顶部居中标题 */
.brand {
  position: absolute;
  z-index: 3;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.brand-title {
  position: relative;
  font-size: 64px;
  letter-spacing: 18px;
  margin: 0;
  color: #f2f2f0;
  text-shadow:
    0 2px 0 rgba(0, 0, 0, 0.5),
    0 12px 30px rgba(0, 0, 0, 0.6);
}

/* 居中登录弹窗 */
.dialog {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  padding: 30px 28px 24px;
  background: rgba(10, 10, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 4px;
  backdrop-filter: blur(8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: rise 0.5s ease;
}

@keyframes rise {
  from { opacity: 0; transform: translate(-50%, -46%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 18px;
}

.tabs span {
  font-size: 15px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tabs span.on {
  color: #fff;
  border-color: #fff;
}

.tip {
  font-size: 12px;
  text-align: center;
  padding: 7px;
  margin-bottom: 12px;
  border-radius: 2px;
}

.tip.err { color: #eee; background: rgba(255, 255, 255, 0.12); }
.tip.ok  { color: #eee; background: rgba(255, 255, 255, 0.12); }

.tip-enter-active, .tip-leave-active,
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.tip-enter-from, .tip-leave-to,
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fields input {
  width: 100%;
  height: 38px;
  margin-bottom: 12px;
  padding: 0 2px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  color: #f2f2f0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.fields input::placeholder { color: rgba(255, 255, 255, 0.4); }
.fields input:focus { border-color: #fff; }

.cta {
  position: relative;
  width: 100%;
  height: 44px;
  margin-top: 4px;
  border: none;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(120deg, #f5f5f2 0%, #d9d9d6 50%, #b8b8b4 100%);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s, opacity 0.2s;
}

.cta span {
  position: relative;
  z-index: 1;
  font-size: 15px;
  letter-spacing: 5px;
  color: #111;
  font-weight: 600;
}

.cta::after {
  content: "";
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: rgba(0, 0, 0, 0.12);
  transform: skewX(-20deg);
}

.cta:active:not(:disabled) { transform: scale(0.98); }
.cta:disabled { opacity: 0.55; cursor: not-allowed; }

.guest {
  margin: 12px 0 0;
  text-align: center;
  font-size: 12px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.2s;
}

.guest:hover { color: #fff; }
.guest.disabled { pointer-events: none; opacity: 0.5; }
</style>