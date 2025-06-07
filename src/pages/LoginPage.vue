<template>
  <div class="login-container">
    <div class="login-header">
      <h1>RestON <span>Администратор</span></h1>
    </div>

    <div class="login-form">
      <h2>Вход</h2>
      
      <div v-if="!isCodeSent">
        <p class="login-subtitle">Даже если вы не зарегистрированы, аккаунт будет создан автоматически</p>
        
        <div class="form-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="email@domain.com"
            class="form-input"
          />
        </div>

        <button 
          @click="sendCode" 
          class="primary-button"
          :disabled="!isValidEmail"
        >
          Отправить код
        </button>
      </div>

      <div v-else>
        <p class="login-subtitle">Введите код из письма отправленного на {{ email }}</p>
        
        <div class="form-group">
          <input 
            type="text" 
            v-model="verificationCode" 
            placeholder="232212"
            class="form-input verification-input"
            maxlength="6"
          />
        </div>

        <button 
          @click="verifyCode" 
          class="primary-button verify-button"
        >
          Подтвердить
        </button>
      </div>

      <div class="divider">
        <span>или продолжить с</span>
      </div>

      <button @click="signInWithGoogle" class="google-button">
        <img src="@/assets/google-icon.svg" alt="Google" />
        Google
      </button>

      <p class="terms">
        Продолжая, вы соглашаетесь с нашими 
        <a href="/terms">Условиями использования</a> и 
        <a href="/privacy">Политикой конфиденциальности</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const verificationCode = ref('')
const isCodeSent = ref(false)
const router = useRouter()

// Type assertion to help TypeScript understand the component structure
const component = {
  email,
  verificationCode,
  isCodeSent
} as const

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const sendCode = async () => {
  try {
    // TODO: Implement API call to send verification code
    isCodeSent.value = true
  } catch (error) {
    console.error('Failed to send code:', error)
  }
}

const verifyCode = async () => {
  try {
    if (verificationCode.value.length === 6) {
      // В реальном приложении здесь была бы проверка кода
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Failed to verify code:', error)
  }
}

const signInWithGoogle = async () => {
  try {
    // TODO: Implement Google OAuth
    console.log('Signing in with Google')
  } catch (error) {
    console.error('Failed to sign in with Google:', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  padding: 2rem;
  background-color: #fff;
}

.login-header {
  margin-bottom: 4rem;
  text-align: left;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

.login-header span {
  font-weight: normal;
  color: #666;
}

.login-form {
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 0 auto;
}

.login-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.login-subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
}

.verification-input {
  text-align: center;
  letter-spacing: 0.1em;
  font-size: 1.2rem;
}

.primary-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #818cf8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #6366f1;
}

.primary-button:disabled {
  background-color: #c7c7c7;
  cursor: not-allowed;
}

.verify-button {
  background-color: #4338ca;
}

.verify-button:hover {
  background-color: #3730a3;
}

.divider {
  margin: 2rem 0;
  position: relative;
  text-align: center;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: #fff;
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.google-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-button:hover {
  background-color: #e9ecef;
}

.google-button img {
  width: 20px;
  height: 20px;
}

.terms {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #666;
}

.terms a {
  color: #4338ca;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}
</style>
