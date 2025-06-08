<template>
  <div class="storage-page">
    <div class="page-header">
      <h1>Склад</h1>
    </div>

    <div class="content-grid">
      <!-- Остатки -->
      <div class="content-section">
        <div class="section-header">
          <div>
            <h2>Остатки</h2>
            <p class="section-description">Остатки ингредиентов, товаров и блюд на складе</p>
          </div>
        </div>

        <div class="items-list">
          <div v-for="item in remainingItems" :key="item.name" class="item-row">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-quantity">{{ item.quantity }}{{ item.unit }}</div>
            <div class="item-total">{{ item.total }} ₽</div>
          </div>
        </div>

        <div class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="pagination-btn"
          >
            <
          </button>
          <span class="page-info">{{ currentPage }}/{{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="pagination-btn"
          >
            >
          </button>
        </div>
      </div>

      <!-- Движения на складе -->
      <div class="content-section">
        <div class="section-header">
          <div>
            <h2>Движения на складе</h2>
            <p class="section-description">Поставки и списания ингредиентов, товаров и блюд</p>
          </div>
          <div class="date-selector" @click="openPeriodModal">
            <span class="calendar-icon">📅</span>
            {{ formatDateRange(selectedStartDate, selectedEndDate) }}
          </div>
        </div>

        <div class="movements-list">
          <div class="movements-header">
            <div>ПОЗИЦИИ</div>
            <div>ДАТА</div>
            <div>ИТОГО</div>
          </div>
          <template v-if="store.getMovementsByDate(selectedStartDate).length">
            <div v-for="movement in store.getMovementsByDate(selectedStartDate)" :key="movement.id" class="movement-item">
              <div class="movement-details">
                <span :class="['movement-indicator', movement.type]">{{ movement.type === 'in' ? '+' : '-' }}</span>
                <span class="movement-name">{{ movement.name }}</span>
                <span class="movement-quantity">{{ movement.quantity }}</span>
              </div>
              <div class="movement-date">{{ movement.date }}</div>
              <div :class="['movement-total', movement.type]">
                {{ movement.type === 'in' ? '+' : '-' }}{{ movement.total }} ₽
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-movements">В этот день не было поставок или списаний.</div>
          </template>
        </div>

        <div class="action-buttons">
          <button class="btn-primary write-off" @click="openWriteOffModal">Списать</button>
          <button class="btn-primary supply" @click="openSupplyModal">Поставить</button>
        </div>
      </div>
    </div>
  </div>

  <PeriodModal
    v-model:isOpen="isPeriodModalOpen"
    @close="handlePeriodClose"
    @save="handlePeriodSave"
  />

  <WriteOffModal
    v-model:isOpen="isWriteOffModalOpen"
    :date="selectedStartDate"
    :ingredients-list="menuIngredients"
    @save="handleWriteOffSave"
  />

  <SupplyModal
    v-model:isOpen="isSupplyModalOpen"
    :date="selectedStartDate"
    :ingredients-list="menuIngredients"
    @save="handleSupplySave"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PeriodModal from '@/components/PeriodModal.vue'
import WriteOffModal from '@/components/WriteOffModal.vue'
import SupplyModal from '@/components/SupplyModal.vue'
import { useStorageStore } from '@/stores/storage'
import { ingredients as baseIngredients } from '@/data/ingredients'

// Store
const store = useStorageStore()

// Количество элементов на странице
const itemsPerPage = 8

// Вычисляемые данные для текущей страницы
const remainingItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return store.items.slice(start, end)
})

// Пагинация
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(store.items.length / itemsPerPage))

// Модальные окна
const isPeriodModalOpen = ref(false)
const isWriteOffModalOpen = ref(false)
const isSupplyModalOpen = ref(false)

const selectedStartDate = ref<Date>(new Date())
const selectedEndDate = ref<Date | null>(null)

const openPeriodModal = () => {
  isPeriodModalOpen.value = true
}

const openWriteOffModal = () => {
  isWriteOffModalOpen.value = true
}

const openSupplyModal = () => {
  isSupplyModalOpen.value = true
}

const handlePeriodClose = () => {
  isPeriodModalOpen.value = false;
}

const handlePeriodSave = (period: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => {
  selectedStartDate.value = period.startDate;
  selectedEndDate.value = period.endDate;
  isPeriodModalOpen.value = false;
}

const handleWriteOffSave = (data: { items: any[]; date: Date }) => {
  store.addMovement('out', data.items, data.date)
  isWriteOffModalOpen.value = false
}

const handleSupplySave = (data: { items: any[]; date: Date }) => {
  store.addMovement('in', data.items, data.date)
  isSupplyModalOpen.value = false
}

const formatDate = (date: Date) => {
  const day = date.getDate()
  const month = date.toLocaleString('ru', { month: 'long' })
  return `${day} ${month}`
}

const formatDateRange = (startDate: Date, endDate: Date | null) => {
  if (!endDate || isSameDay(startDate, endDate)) {
    return formatDate(startDate)
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear()
}

// --- Синхронизация остатков с ингредиентами меню ---
function syncIngredientsToStorage() {
  // Сохраняем старые количества и total по имени
  const oldMap = new Map(store.items.map(i => [i.name, i]))
  store.items.length = 0
  baseIngredients.forEach(ing => {
    const old = oldMap.get(ing.name)
    store.items.push({
      name: ing.name,
      unit: ing.unit as 'кг' | 'шт' | 'л',
      quantity: old ? old.quantity : 0,
      total: old ? old.total : 0
    })
  })
}
// Первичная синхронизация
syncIngredientsToStorage()
// Следить за изменениями ингредиентов
watch(baseIngredients, syncIngredientsToStorage, { deep: true })

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return fallback
}

const menuIngredients = loadFromStorage('editmenu_ingredients', baseIngredients)
</script>

<style scoped>
.storage-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6B7280;
  font-size: 0.875rem;
}

.items-list {
  margin-bottom: 1.5rem;
  min-height: 480px;
  max-height: 480px;
  height: 480px;
  overflow: hidden;
}

.item-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E5E7EB;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: #6B7280;
}

.item-total {
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
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

.page-info {
  color: #6B7280;
  font-size: 0.875rem;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #4338ca;
  border-radius: 6px;
  cursor: pointer;
  color: #1a1a1a;
}

.calendar-icon {
  font-size: 1.25rem;
}

.movements-list {
  margin-bottom: 1.5rem;
}

.movements-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.75rem 0;
  color: #6B7280;
  font-size: 0.75rem;
}

.movement-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E5E7EB;
}

.movement-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.movement-indicator {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
}

.movement-indicator.in {
  color: #16A34A;
}

.movement-indicator.out {
  color: #DC2626;
}

.movement-name {
  font-weight: 500;
}

.movement-quantity {
  color: #6B7280;
  font-size: 0.875rem;
}

.movement-date {
  color: #6B7280;
  font-size: 0.875rem;
}

.movement-total {
  font-weight: 600;
  min-width: 100px;
  text-align: right;
}

.movement-total.in {
  color: #16A34A;
}

.movement-total.out {
  color: #DC2626;
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
  background-color: #4338CA;
}

.btn-primary:hover {
  opacity: 0.9;
}

.no-movements {
  color: #6c757d;
  text-align: center;
  padding: 2.5rem 0;
  font-size: 1.05rem;
}
</style> 