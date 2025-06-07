<template>
  <div class="general-statistics">
    <div class="content-header">
      <h2>Общая статистика</h2>
    </div>

    <div class="stats-container">
      <div class="sales-chart">
        <div class="chart-header">
          <h3>Анализ продаж</h3>
          <div class="chart-controls">
            <div class="current-value">
              <div class="date">15 марта 2024</div>
              <div class="amount">54 788 ₽</div>
            </div>
            <select class="period-select">
              <option>По месяцам</option>
              <option>По неделям</option>
              <option>По дням</option>
            </select>
          </div>
        </div>
        <LineChart />
      </div>

      <div class="top-sales">
        <div class="section-header">
          <h3>Топ-3 продаж</h3>
          <button class="more-btn">•••</button>
        </div>
        <DonutChart />
        <div class="chart-legend">
          <div class="legend-item">
            <span class="color-dot blue"></span>
            <span class="label">Кола 0.5л</span>
          </div>
          <div class="legend-item">
            <span class="color-dot pink"></span>
            <span class="label">Донер</span>
          </div>
          <div class="legend-item">
            <span class="color-dot mint"></span>
            <span class="label">Гавайская стандарт</span>
          </div>
        </div>
      </div>

      <div class="period-selector">
        <button class="period-btn active">За последнюю смену</button>
        <button class="period-btn">За последнюю неделю</button>
        <button class="period-btn">За последний месяц</button>
        <button class="period-btn">За последние 3 месяца</button>
        <button class="period-btn">За последние полгода</button>
        <button class="period-btn">За последний год</button>
        <button class="period-btn custom" @click="openPeriodModal">
          <span class="calendar-icon">📅</span>
          Настроить период...
        </button>
      </div>

      <div class="stats-summary">
        <div class="stat-card">
          <h4>Количество продаж</h4>
          <div class="stat-value">2 431</div>
          <div class="stat-change positive">
            <span class="arrow">↑</span>
            +1.01%
          </div>
        </div>

        <div class="stat-card">
          <h4>В категории Шаурма</h4>
          <div class="stat-value">1 065 988 ₽</div>
          <div class="stat-change positive">
            <span class="arrow">↑</span>
            +0.4%
          </div>
        </div>

        <div class="stat-card">
          <h4>В категории Напитки</h4>
          <div class="stat-value">255 658 ₽</div>
          <div class="stat-change positive">
            <span class="arrow">↑</span>
            +0.47%
          </div>
        </div>

        <div class="stat-card">
          <h4>Выручка</h4>
          <div class="stat-value">1 321 646 ₽</div>
          <div class="stat-change positive">
            <span class="arrow">↑</span>
            +0.78%
          </div>
        </div>
      </div>
    </div>

    <!-- Add modal component -->
    <PeriodModal 
      :is-open="isPeriodModalOpen"
      @close="closePeriodModal"
      @save="handlePeriodSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/components/LineChart.vue'
import DonutChart from '@/components/DonutChart.vue'
import PeriodModal from '@/components/PeriodModal.vue'

const isPeriodModalOpen = ref(false)

const openPeriodModal = () => {
  isPeriodModalOpen.value = true
}

const closePeriodModal = () => {
  isPeriodModalOpen.value = false
}

const handlePeriodSave = (period: {
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
}) => {
  console.log('Selected period:', period)
  closePeriodModal()
}
</script>

<style scoped>
.general-statistics {
  padding: 2rem;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.stats-container {
  display: grid;
  grid-template-columns: auto 300px auto;
  gap: 1.5rem;
}

.sales-chart {
  grid-column: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 400px;
  min-width: 500px;
}

.top-sales {
  grid-column: 2;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 300px;
  width: 300px;
}

.period-selector {
  grid-column: 3;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: fit-content;
  width: 300px;
}

.stats-summary {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1rem;
}

.current-value .date {
  color: #6c757d;
  font-size: 0.875rem;
}

.current-value .amount {
  font-size: 1.5rem;
  font-weight: 600;
}

.period-select {
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #495057;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.more-btn {
  border: none;
  background: none;
  color: #6c757d;
  cursor: pointer;
}

.chart-legend {
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.color-dot.blue { background-color: #4338ca; }
.color-dot.pink { background-color: #ec4899; }
.color-dot.mint { background-color: #14b8a6; }

.period-btn {
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  background-color: #f8f9fa;
}

.period-btn.active {
  background-color: #4338ca;
  color: white;
  border-color: #4338ca;
}

.period-btn.custom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.calendar-icon {
  font-size: 1.1em;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
}

.stat-card h4 {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.stat-change.positive {
  color: #10b981;
}
</style> 