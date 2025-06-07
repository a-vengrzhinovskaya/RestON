<template>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label>Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>
      <div class="mb-4">
        <label>Password</label>
        <input v-model="password" type="password" class="input" required />
      </div>
      <button class="btn-primary">Войти</button>
    </form>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/userStore'
  
  const email = ref('')
  const password = ref('')
  const store = useUserStore()
  const router = useRouter()
  
  const login = async () => {
    const success = await store.login(email.value, password.value)
    if (success) router.push('/dashboard')
    else alert('Ошибка входа')
  }
  </script>