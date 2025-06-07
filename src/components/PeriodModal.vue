<template>
  <div v-if="isOpen" class="modal-overlay" @click="() => closeModal()">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="date-range">
          <div class="date-group">
            <div class="date">{{ formatDate(selectedStartDate) || startDate }}</div>
            <div class="time">
              <input type="time" v-model="startTime" step="60" />
            </div>
          </div>
          <div class="arrow">→</div>
          <div class="date-group">
            <div class="date">{{ formatDate(selectedEndDate) || endDate }}</div>
            <div class="time">
              <input type="time" v-model="endTime" step="60" />
            </div>
          </div>
        </div>
        <button class="save-btn" @click="save">Сохранить</button>
      </div>

      <div class="modal-info">
        Настройте время по умолчанию в зависимости от часов работы (кассовой смены). Вы можете изменить время в 
        <a href="#" class="settings-link">настройках</a>
        или задать другой период здесь.
      </div>

      <div class="calendar-container">
        <div class="calendars">
          <div class="calendar-wrapper">
            <div class="month-selector">
              <button class="nav-btn" @click="previousMonth">&lt;</button>
              <h2>{{ currentMonthName }}</h2>
            </div>

            <div class="calendar">
              <div class="weekdays">
                <div>ПН</div>
                <div>ВТ</div>
                <div>СР</div>
                <div>ЧТ</div>
                <div>ПТ</div>
                <div>СБ</div>
                <div>ВС</div>
              </div>

              <div class="days">
                <div 
                  v-for="day in calendarDays" 
                  :key="`${day.date.getTime()}`"
                  :class="{
                    'day': true,
                    'other-month': !day.currentMonth,
                    'selected': isSelected(day),
                    'in-range': isInRange(day),
                    'today': isToday(day)
                  }"
                  @click="selectDate(day)"
                >
                  {{ day.dayNumber }}
                </div>
              </div>
            </div>
          </div>

          <div class="calendar-wrapper">
            <div class="month-selector">
              <h2>{{ nextMonthName }}</h2>
              <button class="nav-btn" @click="nextMonth">&gt;</button>
            </div>

            <div class="calendar">
              <div class="weekdays">
                <div>ПН</div>
                <div>ВТ</div>
                <div>СР</div>
                <div>ЧТ</div>
                <div>ПТ</div>
                <div>СБ</div>
                <div>ВС</div>
              </div>

              <div class="days">
                <div 
                  v-for="day in nextMonthDays" 
                  :key="`${day.date.getTime()}`"
                  :class="{
                    'day': true,
                    'other-month': !day.currentMonth,
                    'selected': isSelected(day),
                    'in-range': isInRange(day),
                    'today': isToday(day)
                  }"
                  @click="selectDate(day)"
                >
                  {{ day.dayNumber }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'save'])

// Current displayed dates
const startDate = ref('2 мая 2024')
const endDate = ref('12 мая 2024')
const startTime = ref('13:00')
const endTime = ref('02:00')

// Selection state
const currentMonth = ref(new Date())
const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)

// Last saved period
const savedStartDate = ref<Date | null>(null)
const savedEndDate = ref<Date | null>(null)

// Reset current selection to last saved state when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedStartDate.value = savedStartDate.value
    selectedEndDate.value = savedEndDate.value
  }
})

const currentMonthName = computed(() => {
  return currentMonth.value.toLocaleString('ru', { month: 'long' })
})

const nextMonthName = computed(() => {
  const nextMonth = new Date(currentMonth.value)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  return nextMonth.toLocaleString('ru', { month: 'long' })
})

const formatDate = (date: Date | null) => {
  if (!date) return null
  const day = date.getDate()
  const month = date.toLocaleString('ru', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const generateMonthDays = (baseDate: Date) => {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay() || 7
  for (let i = firstDayOfWeek - 1; i > 0; i--) {
    const date = new Date(year, month, 1 - i)
    days.push({
      date,
      dayNumber: date.getDate(),
      currentMonth: false
    })
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      dayNumber: i,
      currentMonth: true
    })
  }
  
  // Add days from next month
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      dayNumber: i,
      currentMonth: false
    })
  }
  
  return days
}

const calendarDays = computed(() => generateMonthDays(currentMonth.value))

const nextMonthDays = computed(() => {
  const nextMonth = new Date(currentMonth.value)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  return generateMonthDays(nextMonth)
})

const previousMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1
  )
}

const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1
  )
}

const isSelected = (day: { date: Date }) => {
  if (!selectedStartDate.value || !selectedEndDate.value) return false
  return (
    day.date.toDateString() === selectedStartDate.value.toDateString() ||
    day.date.toDateString() === selectedEndDate.value.toDateString()
  )
}

const isInRange = (day: { date: Date }) => {
  if (!selectedStartDate.value || !selectedEndDate.value) return false
  return (
    day.date > selectedStartDate.value &&
    day.date < selectedEndDate.value
  )
}

const isToday = (day: { date: Date }) => {
  const today = new Date()
  return day.date.toDateString() === today.toDateString()
}

const selectDate = (day: { date: Date }) => {
  if (!selectedStartDate.value || selectedEndDate.value) {
    selectedStartDate.value = day.date
    selectedEndDate.value = null
  } else {
    if (day.date < selectedStartDate.value) {
      selectedEndDate.value = selectedStartDate.value
      selectedStartDate.value = day.date
    } else {
      selectedEndDate.value = day.date
    }
  }
}

const closeModal = (withSave = false) => {
  if (!withSave) {
    // Reset only current selection, not the saved state
    selectedStartDate.value = savedStartDate.value
    selectedEndDate.value = savedEndDate.value
  }
  emit('close')
}

const save = () => {
  if (selectedStartDate.value && selectedEndDate.value) {
    // Update saved state
    savedStartDate.value = selectedStartDate.value
    savedEndDate.value = selectedEndDate.value
    
    emit('save', {
      startDate: selectedStartDate.value,
      endDate: selectedEndDate.value,
      startTime: startTime.value,
      endTime: endTime.value
    })
    closeModal(true)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 800px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 120px;
}

.date {
  font-size: 1rem;
  color: #1a1a1a;
}

.time {
  position: relative;
  display: flex;
  align-items: center;
}

.time input {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 1rem;
  width: 100px;
  text-align: center;
}

.arrow {
  color: #666;
  margin-top: 1rem;
}

.save-btn {
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.modal-info {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.settings-link {
  color: #4338ca;
  text-decoration: none;
}

.settings-link:hover {
  text-decoration: underline;
}

.calendar-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.calendars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.calendar-wrapper {
  flex: 1;
}

.month-selector {
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
}

.month-selector h2 {
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: capitalize;
  grid-column: 2;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:first-child {
  grid-column: 1;
}

.nav-btn:last-child {
  grid-column: 3;
}

.calendar {
  display: grid;
  gap: 0.5rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  font-size: 0.9rem;
  width: 32px;
  height: 32px;
  margin: 0 auto;
}

.day:hover {
  background: #e0e7ff;
}

.other-month {
  color: #999;
}

.selected {
  background: #4338ca;
  color: white;
}

.in-range {
  background: #e0e7ff;
}

.today {
  border: 2px solid #4338ca;
}
</style> 