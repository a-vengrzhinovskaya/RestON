<template>
  <div class="dashboard">
    <!-- Top bar -->
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
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import StatisticsDropdown from '@/components/StatisticsDropdown.vue'
import MenuDropdown from '@/components/MenuDropdown.vue'
import { useDropdownState } from '@/composables/useDropdownState'
import { onMounted, onUnmounted } from 'vue'

const { closeAllDropdowns } = useDropdownState()

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    closeAllDropdowns()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dashboard {
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

.main-content {
  padding: 2rem;
  max-width: 1400px;
  min-width: 1200px;
  margin: 0 auto;
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