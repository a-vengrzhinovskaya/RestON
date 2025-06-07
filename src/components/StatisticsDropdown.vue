<template>
  <div class="dropdown-container">
    <button 
      class="dropdown-trigger"
      :class="{ active: isOpen || currentSection === '' }"
      @click="toggleDropdown"
    >
      Статистика {{ isOpen ? '↑' : '↓' }}
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <router-link 
        to="/dashboard/cash-shifts"
        class="dropdown-item"
        :class="{ active: currentSection === 'cash-shifts' }"
        @click="selectItem('cash-shifts')"
      >
        Кассовые смены
      </router-link>
      <router-link 
        to="/dashboard/closed-checks"
        class="dropdown-item"
        :class="{ active: currentSection === 'closed-checks' }"
        @click="selectItem('closed-checks')"
      >
        Закрытые чеки
      </router-link>
      <router-link 
        to="/dashboard/sales"
        class="dropdown-item"
        :class="{ active: currentSection === 'sales' }"
        @click="selectItem('sales')"
      >
        Продажи
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDropdownState } from '@/composables/useDropdownState'

const DROPDOWN_NAME = 'statistics'
const route = useRoute()
const { isDropdownOpen, openDropdown } = useDropdownState()
const currentSection = computed(() => {
  const path = route.path
  if (path.startsWith('/dashboard/')) {
    return path.split('/').pop() || ''
  }
  return ''
})

const isOpen = computed(() => isDropdownOpen(DROPDOWN_NAME))

const toggleDropdown = () => {
  openDropdown(DROPDOWN_NAME)
}

const selectItem = (section: string) => {
  openDropdown(DROPDOWN_NAME) // This will close the dropdown since it's already open
}
</script>

<style scoped>
.dropdown-container {
  position: relative;
}

.dropdown-trigger {
  background: none;
  border: none;
  color: #1a1a1a;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dropdown-trigger.active {
  color: #4338ca;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  z-index: 100;
  padding: 0.5rem;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f9;
}

.dropdown-item.active {
  background-color: #e0e7ff;
  color: #4338ca;
  position: relative;
}

.dropdown-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4338ca;
}
</style> 