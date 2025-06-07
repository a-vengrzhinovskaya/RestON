<template>
  <div class="closed-checks">
    <div class="content-header">
      <div class="header-group">
        <h2>Закрытые чеки</h2>
        <div class="date-selector" @click="openPeriodModal">
          <span class="calendar-icon">📅</span>
          <span>{{ formatDateRange(selectedStartDate, selectedEndDate) }}</span>
        </div>
      </div>
    </div>

    <div class="checks-container">
      <table class="checks-table">
        <thead>
          <tr>
            <th>Номер чека</th>
            <th>Стол</th>
            <th>Закрыт</th>
            <th>К оплате</th>
            <th>Выручка</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="showCheckDetails('T-231')" :class="{ active: selectedCheck === 'T-231' }">
            <td>T-231</td>
            <td>1 стол</td>
            <td>12 июня в 13:30</td>
            <td>589 ₽</td>
            <td>589 ₽</td>
          </tr>
          <tr @click="showCheckDetails('T-230')" :class="{ active: selectedCheck === 'T-230' }">
            <td>T-230</td>
            <td>3 стол</td>
            <td>12 июня в 13:15</td>
            <td>1250 ₽</td>
            <td>1250 ₽</td>
          </tr>
          <tr @click="showCheckDetails('T-229')" :class="{ active: selectedCheck === 'T-229' }">
            <td>T-229</td>
            <td>2 стол</td>
            <td>12 июня в 13:00</td>
            <td>890 ₽</td>
            <td>890 ₽</td>
          </tr>
          <tr @click="showCheckDetails('T-228')" :class="{ active: selectedCheck === 'T-228' }">
            <td>T-228</td>
            <td>4 стол</td>
            <td>12 июня в 12:45</td>
            <td>1780 ₽</td>
            <td>1780 ₽</td>
          </tr>
          <tr @click="showCheckDetails('T-227')" :class="{ active: selectedCheck === 'T-227' }">
            <td>T-227</td>
            <td>1 стол</td>
            <td>12 июня в 12:30</td>
            <td>670 ₽</td>
            <td>670 ₽</td>
          </tr>
          <tr @click="showCheckDetails('T-226')" :class="{ active: selectedCheck === 'T-226' }">
            <td>T-226</td>
            <td>5 стол</td>
            <td>12 июня в 12:15</td>
            <td>2340 ₽</td>
            <td>2340 ₽</td>
          </tr>
          <tr @click="showCheckDetails('T-225')" :class="{ active: selectedCheck === 'T-225' }">
            <td>T-225</td>
            <td>2 стол</td>
            <td>12 июня в 12:00</td>
            <td>950 ₽</td>
            <td>950 ₽</td>
          </tr>
        </tbody>
      </table>

      <!-- Check details sidebar -->
      <div v-if="selectedCheck" class="check-details">
        <div class="details-header">
          <h3>Чек {{ selectedCheck }}</h3>
          <button class="close-btn" @click="selectedCheck = null">×</button>
        </div>

        <div class="details-info">
          <div class="info-row">
            <span class="label">Стол:</span>
            <span class="value">1</span>
          </div>
          <div class="info-row">
            <span class="label">Гостей:</span>
            <span class="value">2</span>
          </div>
          <div class="info-row">
            <span class="label">Открыт:</span>
            <span class="value">12 июня 13:28</span>
          </div>
          <div class="info-row">
            <span class="label">Закрыт:</span>
            <span class="value">12 июня 13:30</span>
          </div>
        </div>

        <div class="details-items">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Кол-во</th>
                <th>Цена</th>
                <th>Итого</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Донер</td>
                <td>2</td>
                <td>250 ₽</td>
                <td>500 ₽</td>
              </tr>
              <tr>
                <td>Кола 0.5л</td>
                <td>1</td>
                <td>89 ₽</td>
                <td>89 ₽</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="details-total">
          <div class="total-row">
            <span>Итого:</span>
            <span class="amount">589 ₽</span>
          </div>
          <div class="total-row">
            <span>Оплачено картой:</span>
            <span class="amount">589 ₽</span>
          </div>
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

const selectedCheck = ref<string | null>(null)
const isPeriodModalOpen = ref(false)
const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)

const currentDate = computed(() => new Date())

const showCheckDetails = (checkNumber: string) => {
  selectedCheck.value = checkNumber
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
.closed-checks {
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

.checks-container {
  display: flex;
  gap: 1.5rem;
  height: 100%;
}

.checks-table {
  flex: 1;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.checks-table thead tr {
  background: #f8f9fa;
}

.checks-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #1a1a1a;
  border-bottom: 1px solid #e9ecef;
}

.checks-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.checks-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.checks-table tbody tr:hover {
  background-color: #f8f9fa;
}

.checks-table tbody tr.active {
  background-color: #f8f9fa;
}

.check-details {
  width: 400px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.details-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
}

.details-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.info-row .label {
  color: #6c757d;
}

.details-items table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.details-items th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  color: #6c757d;
  font-weight: normal;
}

.details-items td {
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.details-total {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.amount {
  color: #1a1a1a;
}
</style> 