<template>
  <div class="settings-page">
    <!-- Header -->
    <header class="topbar">
      <div class="logo">
        <h1 class="clickable" @click="$router.push('/dashboard')">RestON <span>Администратор</span></h1>
      </div>
      <div class="header-center">
        <button class="btn-outline" @click="$router.push('/subscription')">Подписка</button>
        <button class="btn-outline active">Настройки</button>
      </div>
      <button class="user-email">
        demo@gmail.com
        <span class="arrow-down">↓</span>
      </button>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <div class="content-wrapper">
        <div class="content-header">
          <h2>Настройки</h2>
          <button class="edit-btn" @click="toggleEdit">{{ isEditing ? 'Сохранить' : 'Изменить' }}</button>
        </div>

        <div class="settings-form">
          <div class="form-row">
            <div class="form-group">
              <label>Имя</label>
              <input 
                type="text" 
                v-model="formData.name" 
                :disabled="!isEditing" 
              />
            </div>

            <div class="form-group">
              <label>Телефон</label>
              <input 
                type="tel" 
                v-model="formData.phone" 
                :disabled="!isEditing" 
              />
            </div>

            <div class="form-group">
              <label>Кассовая смена*</label>
              <TimeRangeInput
                v-model="formData.shift"
                :disabled="!isEditing"
              />
            </div>

            <div class="form-group">
              <label>Логин</label>
              <input 
                type="email" 
                v-model="formData.email" 
                :disabled="!isEditing" 
              />
            </div>

            <div class="form-group">
              <label>Пароль</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="formData.password" 
                  :disabled="!isEditing" 
                />
                <button 
                  class="show-password" 
                  @click.prevent="togglePassword"
                  :class="{ 'active': showPassword }"
                  :disabled="!isEditing"
                >
                  <span class="material-icons">
                    {{ showPassword ? 'visibility' : 'visibility_off' }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="settings-info">
            <div class="info-icon">
              <span class="material-icons">info</span>
            </div>
            <div class="info-text">
              <strong>Настройте часы работы - <span class="muted">Кассовая смена</span></strong>
              <p>Указанное время будет использоваться по умолчанию для календарей, графиков, отчетов и статистики</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TimeRangeInput from '@/components/TimeRangeInput.vue'
import 'material-icons/iconfont/material-icons.css'

const isEditing = ref(false)
const showPassword = ref(false)

const formData = reactive({
  name: 'Иван',
  phone: '8 900 322 45-45',
  shift: '13:00-02:00',
  email: 'demo@gmail.com',
  password: '••••••••••••••'
})

const toggleEdit = () => {
  if (isEditing.value) {
    // TODO: Save changes to backend
    console.log('Saving changes:', formData)
  }
  isEditing.value = !isEditing.value
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #f3f4f9;
  border-bottom: 1px solid #e9ecef;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
}

.logo h1:hover {
  opacity: 0.8;
}

.logo span {
  font-weight: normal;
  color: #6c757d;
}

.header-center {
  display: flex;
  gap: 1rem;
  justify-self: center;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #4338ca;
  border-radius: 6px;
  background: white;
  color: #4338ca;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-outline.active {
  background: #4338ca;
  color: white;
}

.user-email {
  justify-self: end;
  color: #6366f1;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-email:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.arrow-down {
  color: #6c757d;
  font-size: 0.75rem;
}

.main-content {
  padding: 2rem;
  margin: 0 auto;
}

.content-wrapper {
  width: fit-content;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0;
}

.content-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.edit-btn {
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.settings-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 180px 200px 320px 240px 180px;
  gap: 1.25rem;
  margin-bottom: 2rem;
  min-width: min-content;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group input {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  background-color: white;
  color: #1a1a1a;
  height: 42px;
  box-sizing: border-box;
}

.form-group input:disabled {
  color: #1a1a1a;
  cursor: not-allowed;
  background-color: white;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.show-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.show-password:disabled {
  cursor: default;
}

.show-password .material-icons {
  font-size: 16px;
}

.show-password:not(:disabled):hover,
.show-password.active:not(:disabled) {
  color: #4338ca;
}

.settings-info {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  background: none;
  border-radius: 8px;
}

.info-icon {
  color: #10b981;
  width: 24px;
  height: 24px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon .material-icons {
  font-size: 16px;
}

.info-text strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  font-weight: normal;
}

.info-text strong .muted {
  color: #6c757d;
  font-weight: 600;
}

.info-text p {
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}
</style> 