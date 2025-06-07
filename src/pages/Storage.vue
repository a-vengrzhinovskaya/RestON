<template>
  <div class="storage">
    <!-- Header -->
    <header class="topbar">
      <div class="logo">
        <h1 class="clickable" @click="$router.push('/dashboard')">RestON <span>Администратор</span></h1>
      </div>
      <div class="header-center">
        <button class="btn-outline" @click="$router.push('/subscription')">Подписка</button>
        <button class="btn-outline" @click="$router.push('/settings')">Настройки</button>
      </div>
      <button class="user-email">
        demo@gmail.com
        <span class="arrow-down">↓</span>
      </button>
    </header>

    <!-- Navigation bar -->
    <nav class="navbar">
      <div class="restaurant-name">DonerHome</div>
      <div class="nav-links">
        <StatisticsDropdown />
        <MenuDropdown />
        <router-link to="/hall" class="nav-link">
          Схема зала
        </router-link>
        <router-link to="/staff" class="nav-link">
          Сотрудники
        </router-link>
      </div>
    </nav>

    <!-- Main content -->
    <div class="storage-content">
      <!-- Остатки -->
      <div class="storage-section">
        <h2>Остатки</h2>
        <p class="section-description">Остатки ингредиентов, товаров и блюд на складе</p>
        
        <table class="storage-table">
          <thead>
            <tr>
              <th>НАЗВАНИЕ</th>
              <th>КОЛИЧЕСТВО</th>
              <th>ИТОГО</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in remainingItems" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}{{ item.unit }}</td>
              <td class="price">{{ formatPrice(item.total) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">&lt;</button>
          <span>{{ currentPage }}/{{ totalPages }}</span>
          <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">&gt;</button>
        </div>
      </div>

      <!-- Движения на складе -->
      <div class="storage-section">
        <div class="section-header">
          <div>
            <h2>Движения на складе</h2>
            <p class="section-description">Поставки и списания ингредиентов, товаров и блюд</p>
          </div>
          <div class="date-selector">
            <span class="calendar-icon">📅</span>
            12 мая - 12 июня
          </div>
        </div>

        <table class="storage-table">
          <thead>
            <tr>
              <th>ПОЗИЦИИ</th>
              <th>ДАТА</th>
              <th>ИТОГО</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in storageMovements" :key="movement.id">
              <td>
                <span :class="{ 'movement-type': true, 'plus': movement.type === 'in', 'minus': movement.type === 'out' }">
                  {{ movement.type === 'in' ? '+' : '-' }}
                </span>
                {{ movement.name }}
                <span class="quantity">{{ movement.quantity }}</span>
              </td>
              <td>{{ movement.date }}</td>
              <td :class="{ 'price': true, 'negative': movement.type === 'out' }">
                {{ formatPrice(movement.total, movement.type === 'out') }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="action-buttons">
          <button class="btn-primary write-off">Списать</button>
          <button class="btn-primary supply">Поставить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatisticsDropdown from '@/components/StatisticsDropdown.vue'
import MenuDropdown from '@/components/MenuDropdown.vue'

// Данные для остатков
const remainingItems = ref([
  { name: 'Курица', quantity: 89, unit: 'кг', total: 18400 },
  { name: 'Говядина', quantity: 45, unit: 'кг', total: 19780 },
  { name: 'Лаваш (арм)', quantity: 19, unit: 'шт', total: 2100 },
  { name: 'Молоко', quantity: 1.5, unit: 'л', total: 168 },
  { name: 'Кола 0.5 ПЭТ', quantity: 22, unit: 'шт', total: 4577 },
  { name: 'Спрайт 0.5 СТЕКЛО', quantity: 12, unit: 'шт', total: 4577 },
  { name: 'Влажные салфетки', quantity: 9, unit: 'шт', total: 4577 },
  { name: 'Твикс', quantity: 5, unit: 'шт', total: 4577 }
])

// Данные для движений
const storageMovements = ref([
  { id: 1, type: 'in', name: 'Курица', quantity: 'x20кг', date: '11 июня 13:08', total: 6400 },
  { id: 2, type: 'in', name: 'Говядина', quantity: 'x40кг', date: '9 июня 16:34', total: 19250 },
  { id: 3, type: 'out', name: 'Молоко', quantity: 'x2л', date: '6 июня 18:50', total: 210 }
])

// Пагинация
const currentPage = ref(1)
const totalPages = ref(3)

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Форматирование цены
const formatPrice = (price: number, isNegative = false) => {
  return (isNegative ? '-' : '') + price + ' ₽'
}
</script>

<style scoped>
.storage {
  background-color: #F8F9FA;
  min-height: 100vh;
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

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
}

.restaurant-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #1a1a1a;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link.active {
  color: #4338ca;
}

.storage-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.storage-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.section-description {
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #F3F4F6;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
}

.calendar-icon {
  color: #6B7280;
}

.storage-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.storage-table th {
  text-align: left;
  padding: 0.75rem;
  color: #6B7280;
  font-weight: normal;
  border-bottom: 1px solid #E5E7EB;
  font-size: 0.75rem;
}

.storage-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #E5E7EB;
  color: #111827;
}

.price {
  font-weight: 600;
}

.negative {
  color: #EF4444;
}

.movement-type {
  display: inline-block;
  width: 16px;
  margin-right: 0.25rem;
}

.movement-type.plus {
  color: #10B981;
}

.movement-type.minus {
  color: #EF4444;
}

.quantity {
  color: #6B7280;
  margin-left: 0.25rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.pagination-btn {
  background: none;
  border: none;
  color: #4338CA;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
}

.pagination-btn:disabled {
  color: #D1D5DB;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
}

.write-off, .supply {
  background-color: #4338CA;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style> 