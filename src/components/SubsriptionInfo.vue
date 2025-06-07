<template>
    <div class="bg-white p-4 rounded-xl shadow">
      <h2 class="font-semibold text-lg">Подписка</h2>
      <p>Тариф: {{ subscription?.plan }}</p>
      <p>Действует до: {{ subscription?.expires }}</p>
      <button class="btn-primary mt-2" @click="pay">Оплатить</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const subscription = ref(null)
  
  onMounted(async () => {
    const res = await axios.get('/api/subscription')
    subscription.value = res.data
  })
  
  const pay = () => {
    alert('Перенаправление на оплату')
  }
  </script>