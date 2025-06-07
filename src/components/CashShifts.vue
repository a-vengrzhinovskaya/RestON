<template>
  <div class="cash-shifts">
    <!-- Список смен -->
    <div v-if="!selectedShift">
      <div class="content-header">
        <div class="header-group">
          <h2>Кассовые смены</h2>
          <div class="date-selector" @click="openPeriodModal">
            <span class="calendar-icon">📅</span>
            <span>{{ formatDateRange(selectedStartDate, selectedEndDate) }}</span>
          </div>
        </div>
      </div>

      <div class="shifts-summary">
        Всего {{ shiftsData.length }} {{ getNounForm(shiftsData.length, ['смена', 'смены', 'смен']) }}. 
        Общая выручка: {{ formatMoney(totalRevenue) }}
      </div>

      <div class="shifts-container">
        <table class="shifts-table">
          <thead>
            <tr>
              <th>Смена открыта</th>
              <th>Смена закрыта</th>
              <th>Выручка</th>
              <th>Безналичные</th>
              <th>Наличные</th>
              <th>Разница наличных</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="shift in shiftsData" 
              :key="shift.id"
              @click="selectShift(shift)"
              class="clickable"
            >
              <td>{{ shift.openedAt }}</td>
              <td>{{ shift.closedAt }}</td>
              <td class="money">{{ formatMoney(shift.revenue) }}</td>
              <td class="money">{{ formatMoney(shift.cardPayments) }}</td>
              <td class="money">{{ formatMoney(shift.cashPayments) }}</td>
              <td class="money">{{ formatMoney(shift.cashDifference) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Детализация смены -->
    <div v-else class="shift-details">
      <div class="details-header">
        <div class="header-group">
          <button class="back-button" @click="selectedShift = null">←</button>
          <h2>
            <span class="black-text">Кассовые смены /&nbsp;</span>
            <span class="gray-text">Отчет от {{ formatShortDate(selectedShift.openedAt) }}</span>
          </h2>
          <div class="date-selector" @click="openPeriodModal">
            <span class="calendar-icon">📅</span>
            <span>{{ formatDateTimeRange(selectedShift.openedAt, selectedShift.closedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="shift-info">
        <div class="info-row">
          <span class="label">Открыта:</span>
          <span>{{ selectedShift.openedAt }}</span>
        </div>
        <div class="info-row">
          <span class="label">Закрыта:</span>
          <span>{{ selectedShift.closedAt }}</span>
        </div>
      </div>

      <div class="details-grid">
        <!-- Левая колонка -->
        <div class="details-column">
          <div class="detail-row">
            <span class="label">Итого</span>
            <span class="value money">{{ formatMoney(selectedShift.total) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Скидки</span>
            <span class="value money">{{ formatMoney(selectedShift.discounts) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">За счет заведения</span>
            <span class="value money">{{ formatMoney(selectedShift.houseAccount) }}</span>
          </div>
          <div class="detail-row total">
            <span class="label">К оплате</span>
            <span class="value money">{{ formatMoney(selectedShift.revenue) }}</span>
          </div>
        </div>

        <!-- Правая колонка -->
        <div class="details-column">
          <div class="detail-row">
            <span class="label">Наличными</span>
            <span class="value money">{{ formatMoney(selectedShift.cashPayments) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Картой</span>
            <span class="value money">{{ formatMoney(selectedShift.cardPayments) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Под з/п</span>
            <span class="value money">{{ formatMoney(selectedShift.salary) }}</span>
          </div>
          <div class="employee-payments">
            <div class="detail-row sub-row" v-for="emp in selectedShift.employees" :key="emp.name">
              <span class="label">{{ emp.name }}</span>
              <span class="value money">{{ formatMoney(emp.amount) }}</span>
            </div>
          </div>
          <div class="detail-row">
            <span class="label">Выручка</span>
            <span class="value money">{{ formatMoney(selectedShift.revenue) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Валовая прибыль</span>
            <span class="value money">{{ formatMoney(selectedShift.grossProfit) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Средний чек</span>
            <span class="value money">{{ formatMoney(selectedShift.averageCheck) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Количество чеков</span>
            <span class="value">{{ selectedShift.checksCount }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Количество гостей</span>
            <span class="value">{{ selectedShift.guestsCount }}</span>
          </div>
        </div>
      </div>

      <div class="positions-section">
        <h3>Позиции</h3>
        <table class="positions-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Количество</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedShift.items" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td class="money">{{ formatMoney(item.total) }}</td>
            </tr>
          </tbody>
        </table>
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
const selectedShift = ref<ShiftData | null>(null)

interface ShiftData {
  id: number
  openedAt: string
  closedAt: string
  revenue: number
  cardPayments: number
  cashPayments: number
  cashDifference: number
  total: number
  discounts: number
  houseAccount: number
  salary: number
  grossProfit: number
  averageCheck: number
  checksCount: number
  guestsCount: number
  employees: { name: string; amount: number }[]
  items: { name: string; quantity: number; total: number }[]
}

// Моковые данные для примера
const shiftsData = ref<ShiftData[]>([
  {
    id: 1,
    openedAt: '12 июня 2024, 13:00',
    closedAt: '12 июня 2024, 02:01',
    revenue: 23456,
    total: 24245,
    discounts: 789,
    houseAccount: 0,
    cardPayments: 21106,
    cashPayments: 2350,
    cashDifference: 0,
    salary: 0,
    grossProfit: 19522,
    averageCheck: 569,
    checksCount: 17,
    guestsCount: 57,
    employees: [
      { name: 'Тимур', amount: 0 },
      { name: 'Ольга', amount: 0 }
    ],
    items: [
      { name: 'Вода без газа 0.5л', quantity: 34, total: 3400 },
      { name: 'Донер', quantity: 25, total: 6250 },
      { name: 'Гавайская стандарт', quantity: 21, total: 8400 },
      { name: 'Классическая мини', quantity: 19, total: 5130 },
      { name: 'Кола 0.5л', quantity: 3, total: 276 }
    ]
  },
  {
    id: 2,
    openedAt: '11 июня 2024, 13:00',
    closedAt: '11 июня 2024, 23:45',
    revenue: 31250,
    total: 32100,
    discounts: 850,
    houseAccount: 0,
    cardPayments: 28125,
    cashPayments: 3125,
    cashDifference: 0,
    salary: 0,
    grossProfit: 25000,
    averageCheck: 625,
    checksCount: 25,
    guestsCount: 75,
    employees: [
      { name: 'Анна', amount: 0 },
      { name: 'Михаил', amount: 0 }
    ],
    items: [
      { name: 'Донер', quantity: 35, total: 8750 },
      { name: 'Кола 0.5л', quantity: 40, total: 3680 },
      { name: 'Гавайская стандарт', quantity: 28, total: 11200 },
      { name: 'Классическая мини', quantity: 25, total: 6750 },
      { name: 'Вода без газа 0.5л', quantity: 27, total: 2700 }
    ]
  },
  {
    id: 3,
    openedAt: '10 июня 2024, 13:00',
    closedAt: '11 июня 2024, 01:30',
    revenue: 28750,
    total: 29500,
    discounts: 750,
    houseAccount: 0,
    cardPayments: 25875,
    cashPayments: 2875,
    cashDifference: 0,
    salary: 0,
    grossProfit: 23000,
    averageCheck: 575,
    checksCount: 23,
    guestsCount: 69,
    employees: [
      { name: 'Тимур', amount: 0 },
      { name: 'Ольга', amount: 0 }
    ],
    items: [
      { name: 'Донер', quantity: 32, total: 8000 },
      { name: 'Гавайская стандарт', quantity: 25, total: 10000 },
      { name: 'Кола 0.5л', quantity: 35, total: 3220 },
      { name: 'Классическая мини', quantity: 22, total: 5940 },
      { name: 'Вода без газа 0.5л', quantity: 30, total: 3000 }
    ]
  },
  {
    id: 4,
    openedAt: '9 июня 2024, 13:00',
    closedAt: '10 июня 2024, 00:15',
    revenue: 26875,
    total: 27500,
    discounts: 625,
    houseAccount: 0,
    cardPayments: 24187,
    cashPayments: 2688,
    cashDifference: 0,
    salary: 0,
    grossProfit: 21500,
    averageCheck: 537,
    checksCount: 21,
    guestsCount: 63,
    employees: [
      { name: 'Анна', amount: 0 },
      { name: 'Михаил', amount: 0 }
    ],
    items: [
      { name: 'Донер', quantity: 30, total: 7500 },
      { name: 'Гавайская стандарт', quantity: 23, total: 9200 },
      { name: 'Кола 0.5л', quantity: 32, total: 2944 },
      { name: 'Классическая мини', quantity: 20, total: 5400 },
      { name: 'Вода без газа 0.5л', quantity: 28, total: 2800 }
    ]
  },
  {
    id: 5,
    openedAt: '8 июня 2024, 13:00',
    closedAt: '9 июня 2024, 01:45',
    revenue: 33750,
    total: 34800,
    discounts: 1050,
    houseAccount: 0,
    cardPayments: 30375,
    cashPayments: 3375,
    cashDifference: 0,
    salary: 0,
    grossProfit: 27000,
    averageCheck: 675,
    checksCount: 27,
    guestsCount: 81,
    employees: [
      { name: 'Тимур', amount: 0 },
      { name: 'Ольга', amount: 0 }
    ],
    items: [
      { name: 'Донер', quantity: 38, total: 9500 },
      { name: 'Гавайская стандарт', quantity: 30, total: 12000 },
      { name: 'Кола 0.5л', quantity: 45, total: 4140 },
      { name: 'Классическая мини', quantity: 28, total: 7560 },
      { name: 'Вода без газа 0.5л', quantity: 36, total: 3600 }
    ]
  }
])

const totalRevenue = computed(() => {
  return shiftsData.value.reduce((sum, shift) => sum + shift.revenue, 0)
})

const currentDate = computed(() => new Date())

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount).replace('₽', '₽')
}

const formatShortDate = (dateStr: string): string => {
  return dateStr.split(',')[0]
}

const formatDateTimeRange = (start: string, end: string): string => {
  const startParts = start.split(', ')
  const endParts = end.split(', ')
  return `${startParts[1]} - ${endParts[1]}`
}

const getNounForm = (number: number, forms: [string, string, string]): string => {
  const cases = [2, 0, 1, 1, 1, 2]
  const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]
  return forms[index]
}

const selectShift = (shift: ShiftData) => {
  selectedShift.value = shift
}

const openPeriodModal = () => {
  isPeriodModalOpen.value = true
}

const handlePeriodSave = (period: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => {
  selectedStartDate.value = period.startDate
  selectedEndDate.value = period.endDate
  isPeriodModalOpen.value = false
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
.cash-shifts {
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

.shifts-summary {
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.shifts-container {
  display: flex;
  gap: 1.5rem;
  height: 100%;
}

.shifts-table {
  flex: 1;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.shifts-table thead tr {
  background: #f8f9fa;
}

.shifts-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 1px solid #e9ecef;
}

.shifts-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #1a1a1a;
}

.shifts-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.shifts-table tbody tr:hover {
  background-color: #f8f9fa;
}

.shifts-table tbody tr.active {
  background-color: #f8f9fa;
}

.shift-details {
  width: 100%;
}

.details-header {
  margin-bottom: 1.5rem;
}

.details-header .header-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.details-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1a1a1a;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -0.5rem;
}

.shift-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.info-row .label {
  color: #6c757d;
  min-width: 70px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.details-column {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.detail-row .label {
  color: #1a1a1a;
}

.detail-row.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  font-weight: 500;
}

.employee-payments {
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.sub-row {
  padding-left: 1rem;
  font-size: 0.9em;
  color: #1a1a1a;
}

.sub-row .label {
  color: #1a1a1a;
}

.positions-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
}

.positions-section h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.positions-table {
  width: 100%;
  border-collapse: collapse;
}

.positions-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  color: #6c757d;
  font-weight: normal;
}

.positions-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  color: #1a1a1a;
}

.clickable {
  cursor: pointer;
}

.header-left h2 {
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.black-text {
  color: #1a1a1a;
}

.gray-text {
  color: #6c757d;
}

.money {
  font-weight: 600;
}

.shifts-table td.money {
  font-weight: 600;
}

.positions-table td.money {
  font-weight: 600;
}

.detail-row .value.money {
  font-weight: 600;
}

.sub-row .value.money {
  font-weight: 600;
}
</style>