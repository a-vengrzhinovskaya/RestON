<template>
  <div class="sales">
    <div class="content-header">
      <div class="header-group">
        <h2>Продажи</h2>
        <div class="date-selector" @click="openPeriodModal">
          <span class="calendar-icon">📅</span>
          <span>{{ formatDateRange(selectedStartDate, selectedEndDate) }}</span>
        </div>
      </div>
    </div>

    <div class="sales-content">
      <!-- Категории -->
      <div class="section">
        <h3>Категории</h3>
        <div class="section-description">Группы и подгруппы позиций в приложении для официантов</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Количество</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.name">
              <td>{{ category.name }}</td>
              <td>{{ category.quantity }}</td>
              <td class="money">{{ formatMoney(category.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Позиции -->
      <div class="section">
        <h3>Позиции</h3>
        <div class="section-description">Товары или блюда, состоящие из ингредиентов</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Количество</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td class="money">{{ formatMoney(item.total) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="prevPage"
          >&lt;</button>
          <span>{{ currentPage }}/{{ totalPages }}</span>
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >&gt;</button>
        </div>
      </div>
    </div>

    <PeriodModal 
      :is-open="isPeriodModalOpen"
      @close="isPeriodModalOpen = false"
      @save="handlePeriodSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PeriodModal from './PeriodModal.vue'

const isPeriodModalOpen = ref(false)
const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)
const currentPage = ref(1)
const itemsPerPage = 8

// Моковые данные для категорий
const categories = ref([
  { name: 'Шаурма', quantity: 680, total: 169400 },
  { name: 'Десерты', quantity: 189, total: 19250 },
  { name: 'Напитки', quantity: 688, total: 50400 },
  { name: 'Другое', quantity: 67, total: 4577 }
])

// Расширенный список позиций
const allItems = ref([
  // Страница 1
  { name: 'Классическая мини', quantity: 340, total: 169400 },
  { name: 'Классическая стандарт', quantity: 289, total: 19250 },
  { name: 'Гавайская стандарт', quantity: 46, total: 50400 },
  { name: 'Гавайская мини', quantity: 34, total: 4577 },
  { name: 'Кола 0.5', quantity: 22, total: 4577 },
  { name: 'Спрайт 0.5', quantity: 12, total: 4577 },
  { name: 'Влажные салфетки', quantity: 9, total: 4577 },
  { name: 'Твикс', quantity: 5, total: 4577 },
  // Страница 2
  { name: 'Острая мини', quantity: 156, total: 42120 },
  { name: 'Острая стандарт', quantity: 134, total: 46900 },
  { name: 'Фанта 0.5', quantity: 45, total: 4140 },
  { name: 'Чизкейк', quantity: 67, total: 20100 },
  { name: 'Морс', quantity: 89, total: 8900 },
  { name: 'Картофель фри', quantity: 178, total: 17800 },
  { name: 'Наггетсы', quantity: 145, total: 21750 },
  { name: 'Соус чесночный', quantity: 234, total: 11700 },
  // Страница 3
  { name: 'Соус острый', quantity: 198, total: 9900 },
  { name: 'Мороженое', quantity: 76, total: 15200 },
  { name: 'Пирожок с вишней', quantity: 46, total: 6900 },
  { name: 'Пирожок с яблоком', quantity: 52, total: 7800 },
  { name: 'Вода без газа 0.5', quantity: 167, total: 16700 },
  { name: 'Вода с газом 0.5', quantity: 143, total: 14300 },
  { name: 'Салфетки бумажные', quantity: 345, total: 3450 },
  { name: 'Зубочистки', quantity: 456, total: 2280 }
])

// Вычисляемые свойства для пагинации
const totalPages = computed(() => Math.ceil(allItems.value.length / itemsPerPage))

const items = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allItems.value.slice(start, end)
})

// Методы для пагинации
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

const currentDate = computed(() => new Date())

const openPeriodModal = () => {
  isPeriodModalOpen.value = true
}

const handlePeriodSave = (period: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => {
  selectedStartDate.value = period.startDate
  selectedEndDate.value = period.endDate
  isPeriodModalOpen.value = false
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('₽', '₽')
}

const formatDate = (date: Date | null) => {
  if (!date) return null
  const day = date.getDate()
  const month = date.toLocaleString('ru', { month: 'long' })
  return `${day} ${month}`
}

const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
  if (!startDate) {
    return `За последнюю смену - ${formatDate(currentDate.value)}`
  }
  
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return formatDate(startDate)
  }
  return `${formatDate(startDate)} — ${formatDate(endDate)}`
}
</script>

<style scoped>
.sales {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-header {
  margin-bottom: 1.5rem;
}

.header-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.content-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1a1a1a;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #4338ca;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-selector:hover {
  background: #f8f9fa;
}

.calendar-icon {
  color: #4338ca;
}

.sales-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
}

.section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 1px solid #e9ecef;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #1a1a1a;
}

.data-table td.money {
  font-weight: 600;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  color: #1a1a1a;
}

.pagination-btn {
  background: none;
  border: none;
  color: #4338ca;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:disabled {
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.5;
}
</style> 