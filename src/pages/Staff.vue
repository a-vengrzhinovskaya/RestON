<template>
  <div class="staff-page">
    <div class="staff-header-row">
      <div class="staff-header">Сотрудники</div>
      <button class="salary-btn" type="button" @click="showSalary = true">Рассчитать зарплату</button>
    </div>
    <div v-if="!showSalary" class="staff-cards">
      <div class="staff-card">
        <div class="card-title">Должности</div>
        <div class="card-desc">Создайте должности, добавьте оклад и укажите какой % от продаж в выбранных категориях будет начисляться сотрудникам</div>
        <div class="staff-table">
          <div class="table-header">
            <div>НАЗВАНИЕ</div>
            <div>КАТЕГОРИИ</div>
            <div>% ОТ ПРОДАЖ</div>
            <div>ОКЛАД</div>
            <div class="icon-cell"></div>
          </div>
          <div class="table-row" v-for="(role, rIdx) in roles" :key="rIdx">
            <div v-for="(field, fIdx) in ['name','categories','percent','salary']" :key="fIdx" @dblclick="startEdit('role', rIdx, field)" class="cell">
              <template v-if="isEditing('role', rIdx, field)">
                <input
                  v-model="editValue"
                  ref="editInputRef"
                  class="edit-input"
                  @blur="finishEdit"
                  @keydown.enter.prevent="finishEdit"
                  @keydown.esc.prevent="cancelEdit"
                  :style="{ width: '100%' }"
                />
              </template>
              <template v-else>
                {{ displayValue(role[field]) }}
              </template>
            </div>
            <div class="icon-cell">
              <span class="material-icons delete-icon" @click="removeRole(rIdx)">delete</span>
            </div>
          </div>
        </div>
        <button class="add-link" @click="addRole" type="button">+ Добавить поле</button>
      </div>
      <div class="staff-card staff-card--employees">
        <div class="card-title">Сотрудники</div>
        <div class="card-desc">Добавьте всех ваших сотрудников</div>
        <div class="staff-table">
          <div class="table-header">
            <div>ПОЛНОЕ ФИО</div>
            <div>ДАТА РОЖДЕНИЯ</div>
            <div>ГРАФИК</div>
            <div class="icon-cell"></div>
          </div>
          <div class="table-row" v-for="(employee, eIdx) in employees" :key="eIdx">
            <div v-for="(field, fIdx) in ['name','birth','schedule']" :key="fIdx" @dblclick="startEdit('employee', eIdx, field)" class="cell">
              <template v-if="isEditing('employee', eIdx, field)">
                <input
                  v-if="field === 'name'"
                  v-model="editValue"
                  ref="editInputRef"
                  class="edit-input"
                  @blur="finishEdit"
                  @keydown.enter.prevent="finishEdit"
                  @keydown.esc.prevent="cancelEdit"
                  :style="{ width: '100%' }"
                />
                <input
                  v-else-if="field === 'birth'"
                  type="date"
                  v-model="editValue"
                  ref="editInputRef"
                  class="edit-input"
                  @blur="finishEdit"
                  @keydown.enter.prevent="finishEdit"
                  @keydown.esc.prevent="cancelEdit"
                  :style="{ width: '100%' }"
                />
                <select
                  v-else-if="field === 'schedule'"
                  v-model="editValue"
                  ref="editInputRef"
                  class="edit-input"
                  @blur="finishEdit"
                  @keydown.enter.prevent="finishEdit"
                  @keydown.esc.prevent="cancelEdit"
                  :style="{ width: '100%' }"
                >
                  <option value="5/2">5/2</option>
                  <option value="2/2">2/2</option>
                </select>
              </template>
              <template v-else>
                {{ displayValue(employee[field], field) }}
              </template>
            </div>
            <div class="icon-cell">
              <span class="material-icons delete-icon" @click="removeEmployee(eIdx)">delete</span>
            </div>
          </div>
        </div>
        <button class="add-link" @click="addEmployee" type="button">+ Добавить поле</button>
      </div>
    </div>
    <div v-else class="salary-calc-wrapper">
      <div class="salary-calc-card">
        <div class="salary-calc-header">
          <div class="salary-calc-title">Расчет заработных плат</div>
          <button class="salary-calc-back" @click="showSalary = false">
            <span class="material-icons">arrow_back</span>
            Назад
          </button>
        </div>
        <div class="salary-calc-filters">
          <div class="salary-calc-filter salary-calc-filter--active" @click="isPeriodModalOpen = true">
            <span class="material-icons">calendar_today</span>
            <span class="salary-calc-filter-value">{{ periodLabel }}</span>
          </div>
          <div class="salary-calc-filter salary-calc-filter--active">
            <select v-model="selectedEmployee">
              <option v-for="emp in employeeNames" :key="emp" :value="emp">{{ emp }}</option>
            </select>
          </div>
          <div class="salary-calc-filter salary-calc-filter--active">
            <select v-model="selectedRole">
              <option value="">Все должности</option>
              <option v-for="role in uniqueRoles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
        </div>
        <div class="salary-calc-main">
          <div class="salary-calc-info salary-calc-info--compact">
            <div class="salary-calc-info-row">
              <span class="salary-calc-info-label">Расчетный период</span>
              <span class="salary-calc-info-value">{{ formattedPeriod }}</span>
            </div>
            <div class="salary-calc-info-row">
              <span class="salary-calc-info-label">ФИО сотрудника</span>
              <span class="salary-calc-info-value">{{ selectedEmployee }}</span>
            </div>
            <div class="salary-calc-info-row">
              <span class="salary-calc-info-label">Должность</span>
              <span class="salary-calc-info-value">{{ selectedRole || 'Все должности' }}</span>
            </div>
            <div class="salary-calc-summary salary-calc-summary--grid">
              <div class="salary-calc-summary-row"><span>Итого</span><span class="salary-calc-summary-value salary-calc-summary-value--main">{{ salaryInfo ? salaryInfo.total.toLocaleString('ru-RU') + ' ₽' : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Оклад 120 часов</span><span class="salary-calc-summary-value">{{ salaryInfo ? salaryInfo.salary.toLocaleString('ru-RU') + ' ₽' : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Стоимость часа переработки</span><span class="salary-calc-summary-value">{{ salaryInfo ? (salaryInfo.overtime ? salaryInfo.overtime + '₽' : '-') : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Процент с продаж</span><span class="salary-calc-summary-value">{{ salaryInfo ? (salaryInfo.percent ?? '-') : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>По категории</span><span class="salary-calc-summary-value">{{ salaryInfo ? (salaryInfo.category ?? '-') : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Под з/п</span><span class="salary-calc-summary-value">{{ salaryInfo ? salaryInfo.podzp.toLocaleString('ru-RU') + ' ₽' : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Авансы</span><span class="salary-calc-summary-value">{{ salaryInfo ? salaryInfo.advances.toLocaleString('ru-RU') + ' ₽' : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Сумма за вычетом авансов</span><span class="salary-calc-summary-value salary-calc-summary-value--main">{{ salaryInfo ? salaryInfo.afterAdvances.toLocaleString('ru-RU') + ' ₽' : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Отработанных смен</span><span class="salary-calc-summary-value">{{ salaryInfo ? salaryInfo.shifts : '-' }}</span></div>
              <div class="salary-calc-summary-row"><span>Количество часов</span><span class="salary-calc-summary-value">{{ salaryInfo ? salaryInfo.hours : '-' }}</span></div>
            </div>
          </div>
        </div>
        <div class="salary-calc-tabs">
          <div class="salary-calc-tab" :class="{active: activeTab === 0}" @click="activeTab = 0">Товары под з/п</div>
          <div class="salary-calc-tab" :class="{active: activeTab === 1}" @click="activeTab = 1">Авансы</div>
          <div class="salary-calc-tab" :class="{active: activeTab === 2}" @click="activeTab = 2">Отработанные смены</div>
        </div>
        <div v-if="activeTab === 0" class="salary-calc-table">
          <div class="salary-calc-table-header">
            <div>Номер чека</div>
            <div>Позиции</div>
            <div class="salary-calc-table-right">Итого</div>
          </div>
          <div class="salary-calc-table-row" v-for="row in salaryRows" :key="row.id">
            <div class="salary-calc-table-link">{{ row.check }}</div>
            <div class="salary-calc-table-pos">{{ row.positions }}</div>
            <div class="salary-calc-table-right">{{ row.total }}</div>
          </div>
        </div>
        <div v-else class="salary-calc-tab-placeholder">
          <span>Эта вкладка еще в разработке</span>
        </div>
        <PeriodModal :is-open="isPeriodModalOpen" @close="isPeriodModalOpen = false" @save="handlePeriodSave" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import PeriodModal from '@/components/PeriodModal.vue'
const roles = ref<Array<{ name: string; categories: string; percent: string | number; salary: string; [key: string]: string | number }>>([
  { name: 'Повар', categories: 'Кухня', percent: 10, salary: '17 400' },
  { name: 'Официант', categories: '-', percent: '', salary: '10 250' },
  { name: 'Бармен', categories: 'Напитки', percent: 15, salary: '30 400' },
  { name: 'Уборщик', categories: '-', percent: '', salary: '5 577' },
])
const employees = ref<Array<{ name: string; birth: string; schedule: string; [key: string]: string }>>([
  { name: 'Иванов Иван Иванович', birth: '05.05.1998', schedule: '5/2' },
  { name: 'Осипов Илья Миронович', birth: '05.05.1998', schedule: '2/2' },
  { name: 'Комаров Кирилл Ильич', birth: '05.05.1998', schedule: '2/2' },
  { name: 'Евсеев Даниил Иванович', birth: '05.05.1998', schedule: '2/2' },
  { name: 'Тун Анастасия Ивановна', birth: '05.05.1998', schedule: '5/2' },
])

const editing = ref<{ type: string, idx: number, field: string }|null>(null)
const editValue = ref('')
const editInputRef = ref<HTMLInputElement|null>(null)
const showSalary = ref(false)
const isPeriodModalOpen = ref(false)
const period = ref({ start: new Date(), end: new Date(), startTime: '13:00', endTime: '02:00' })
const periodLabel = computed(() => {
  const start = period.value.start
  const end = period.value.end
  const startStr = `${start.getDate().toString().padStart(2, '0')}.${(start.getMonth()+1).toString().padStart(2, '0')}.${start.getFullYear()}`
  const endStr = `${end.getDate().toString().padStart(2, '0')}.${(end.getMonth()+1).toString().padStart(2, '0')}.${end.getFullYear()}`
  return `${startStr} ${period.value.startTime} – ${endStr} ${period.value.endTime}`
})
function handlePeriodSave(val: any) {
  period.value.start = val.startDate
  period.value.end = val.endDate
  period.value.startTime = val.startTime
  period.value.endTime = val.endTime
  isPeriodModalOpen.value = false
}
const employeeNames = computed(() => employees.value.map(e => e.name))
const selectedEmployee = ref(employeeNames.value[0] || '')
const uniqueRoles = computed(() => Array.from(new Set(roles.value.map(r => r.name))).filter(Boolean))
const selectedRole = ref('')

// --- MOCK DATA FOR SALARY CALCULATION ---
// Структура: { [employeeName: string]: { [roleName: string]: SalaryInfo } }
interface SalaryCheck {
  id: number;
  check: string;
  positions: string;
  total: string;
}
interface SalaryInfo {
  period: string;
  total: number;
  salary: number;
  overtime: number;
  percent: string | number;
  category: string;
  podzp: number;
  advances: number;
  afterAdvances: number;
  shifts: number;
  hours: number;
  checks: SalaryCheck[];
  [key: string]: any;
}
interface SalaryData {
  [employee: string]: {
    [role: string]: SalaryInfo;
  };
}
const salaryData: SalaryData = {
  'Иванов Иван Иванович': {
    'Официант': {
      period: '12 июня – 13 июля 2025г',
      total: 54245,
      salary: 10250,
      overtime: 442.25,
      percent: '-',
      category: '-',
      podzp: 7350,
      advances: 15000,
      afterAdvances: 31895,
      shifts: 27.5,
      hours: 220,
      checks: [
        { id: 1, check: 'T-231', positions: 'Энергетик 0.5л ×2шт, Наггетсы ×1шт, Жеват...', total: '3 400 ₽' },
        { id: 2, check: 'T-239', positions: 'Энергетик 0.5л ×2шт, Наггетсы ×1шт, Жеват...', total: '250 ₽' },
      ]
    },
    'Бармен': {
      period: '12 июня – 13 июля 2025г',
      total: 30200,
      salary: 30400,
      overtime: 0,
      percent: 15,
      category: 'Напитки',
      podzp: 5000,
      advances: 5000,
      afterAdvances: 20200,
      shifts: 10,
      hours: 80,
      checks: [
        { id: 1, check: 'T-111', positions: 'Коктейль ×2шт, Сок ×1шт', total: '1 200 ₽' },
      ]
    }
  },
  'Осипов Илья Миронович': {
    'Повар': {
      period: '12 июня – 13 июля 2025г',
      total: 17400,
      salary: 17400,
      overtime: 0,
      percent: 10,
      category: 'Кухня',
      podzp: 2000,
      advances: 3000,
      afterAdvances: 12400,
      shifts: 20,
      hours: 160,
      checks: [
        { id: 1, check: 'T-321', positions: 'Шаурма ×3шт', total: '900 ₽' },
      ]
    }
  },
  'Комаров Кирилл Ильич': {
    'Бармен': {
      period: '12 июня – 13 июля 2025г',
      total: 30400,
      salary: 30400,
      overtime: 0,
      percent: 15,
      category: 'Напитки',
      podzp: 4000,
      advances: 5000,
      afterAdvances: 21400,
      shifts: 15,
      hours: 120,
      checks: [
        { id: 1, check: 'T-555', positions: 'Кола 0.5л ×2шт', total: '180 ₽' },
      ]
    }
  },
  'Евсеев Даниил Иванович': {
    'Уборщик': {
      period: '12 июня – 13 июля 2025г',
      total: 5577,
      salary: 5577,
      overtime: 0,
      percent: '-',
      category: '-',
      podzp: 0,
      advances: 0,
      afterAdvances: 5577,
      shifts: 25,
      hours: 200,
      checks: [
        { id: 1, check: 'T-888', positions: 'Уборка зала', total: '5 577 ₽' },
      ]
    }
  },
  'Тун Анастасия Ивановна': {
    'Официант': {
      period: '12 июня – 13 июля 2025г',
      total: 12000,
      salary: 10250,
      overtime: 200,
      percent: 10,
      category: '-',
      podzp: 2000,
      advances: 3000,
      afterAdvances: 7000,
      shifts: 10,
      hours: 80,
      checks: [
        { id: 1, check: 'T-999', positions: 'Десерт ×1шт', total: '200 ₽' },
      ]
    }
  }
}

// Получить список ролей для выбранного сотрудника
const rolesForSelectedEmployee = computed<string[]>(() => {
  const emp = selectedEmployee.value
  if (!emp || !salaryData[emp]) return []
  return Object.keys(salaryData[emp])
})

// Получить данные для выбранного сотрудника и должности
const salaryInfo = computed<SalaryInfo | null>(() => {
  const emp = selectedEmployee.value
  const role = selectedRole.value
  if (!emp || !salaryData[emp]) return null
  if (!role || role === '') {
    // Все должности: суммируем
    const all = Object.values(salaryData[emp]) as SalaryInfo[]
    if (!all.length) return null
    // Суммируем только числовые поля, строки берём из первой должности
    const sum = (field: string) => all.reduce((acc, d) => acc + (typeof d[field] === 'number' ? d[field] : 0), 0)
    return {
      period: all[0].period,
      total: sum('total'),
      salary: sum('salary'),
      overtime: sum('overtime'),
      percent: '-',
      category: '-',
      podzp: sum('podzp'),
      advances: sum('advances'),
      afterAdvances: sum('afterAdvances'),
      shifts: sum('shifts'),
      hours: sum('hours'),
      checks: all.flatMap((d: SalaryInfo) => d.checks)
    }
  }
  return salaryData[emp][role] || null
})

// Для отображения чеков
const salaryRows = computed<SalaryCheck[]>(() => salaryInfo.value?.checks || [])

function isEditing(type: string, idx: number, field: string) {
  return editing.value && editing.value.type === type && editing.value.idx === idx && editing.value.field === field
}
function startEdit(type: string, idx: number, field: string) {
  editing.value = { type, idx, field }
  if (type === 'role') editValue.value = String(roles.value[idx][field] ?? '')
  else editValue.value = String(employees.value[idx][field] ?? '')
  nextTick(() => {
    editInputRef.value?.focus()
    editInputRef.value?.select()
  })
}
function finishEdit() {
  if (!editing.value) return
  const { type, idx, field } = editing.value
  const val = editValue.value.trim()
  if (type === 'role') roles.value[idx][field] = val || ''
  else employees.value[idx][field] = val || ''
  editing.value = null
}
function cancelEdit() {
  editing.value = null
}
function formatDateDisplay(val: string) {
  if (!val || val === '-') return '-';
  // Если уже в формате ДД.ММ.ГГГГ
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) return val;
  // Если ISO (ГГГГ-ММ-ДД)
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-');
    return `${d}.${m}.${y}`;
  }
  return val;
}
function displayValue(val: any, field?: string) {
  if (field === 'birth') return formatDateDisplay(val)
  return val && String(val).trim() !== '' && val !== '-' ? val : '-'
}
function addRole() {
  roles.value.push({ name: '', categories: '', percent: '', salary: '' })
}
function addEmployee() {
  employees.value.push({ name: '', birth: '', schedule: '' })
}
function removeRole(idx: number) {
  roles.value.splice(idx, 1)
}
function removeEmployee(idx: number) {
  employees.value.splice(idx, 1)
}
const activeTab = ref(0)

// Формат для периода: 12 июня - 13 июля 2025
function formatPeriodLabel(period: { start: Date; end: Date }) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  const s = period.start;
  const e = period.end;
  const startStr = `${s.getDate()} ${months[s.getMonth()]}`;
  const endStr = `${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
  return `${startStr} - ${endStr}`;
}
const formattedPeriod = computed(() => formatPeriodLabel(period.value));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
.staff-page {
  padding: 2.5rem 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}
.staff-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.staff-header {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}
.staff-cards {
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  width: 100%;
}
.staff-card {
  background: #fff;
  border: none;
  border-radius: 16px;
  padding: 2rem 2rem 1.5rem 2rem;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}
.staff-card--employees {
  justify-content: flex-start;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}
.card-desc {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}
.staff-table {
  width: 100%;
  border: none;
  background: #fff;
  margin-bottom: 1rem;
}
.table-header {
  display: grid;
  grid-template-columns: 30% 25% 20% 20% 24px;
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 400;
  background: #fff;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
.table-row {
  display: grid;
  grid-template-columns: 30% 25% 20% 20% 24px;
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  min-height: 44px;
}
.staff-card:last-child .table-header,
.staff-card:last-child .table-row {
  grid-template-columns: 60% 25% 15% 24px;
}
.add-link {
  color: #4338ca;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-left: 0;
  background: none;
  border: none;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
}
.add-link:hover {
  color: #3730a3;
  text-decoration: underline;
}
.salary-btn {
  background: #4338ca;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0;
  margin-left: auto;
  transition: background 0.2s;
}
.salary-btn:hover {
  background: #3730a3;
}
.icon-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  width: 24px;
  padding: 0;
  background: #fff;
  overflow: hidden;
}
.delete-icon {
  color: #b0b0b0;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;
}
.delete-icon:hover {
  color: #ef4444;
}
.cell {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.edit-input {
  font-size: 1rem;
  border: 1px solid #a5b4fc;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  min-width: 0;
  max-width: 100%;
  width: 48%;
  padding-right: 0;
  outline: none;
  box-sizing: border-box;
}
/* --- Salary Calc Styles --- */
.salary-calc-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.salary-calc-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 #0001;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.salary-calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.salary-calc-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}
.salary-calc-back {
  background: none;
  border: none;
  color: #4338ca;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.2s;
}
.salary-calc-back:hover {
  background: #ede9fe;
}
.salary-calc-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.salary-calc-filter {
  display: flex;
  align-items: center;
  background: #f6f6fb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #1a1a1a;
  min-width: 220px;
  position: relative;
}
.salary-calc-filter input[type="text"] {
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #1a1a1a;
  width: 100%;
  outline: none;
}
.salary-calc-filter select {
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #1a1a1a;
  width: 100%;
  outline: none;
}
.salary-calc-filter .material-icons {
  font-size: 1.2rem;
  color: #4338ca;
  margin-right: 0.5rem;
}
.salary-calc-main {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 1.5rem;
}
.salary-calc-info {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.salary-calc-info-row {
  display: flex;
  align-items: center;
  gap: 1.2em;
  font-size: 1em;
  margin-bottom: 0.3em;
  white-space: nowrap;
}
.salary-calc-info-label {
  color: #6c757d;
  font-weight: 400;
  min-width: 140px;
  white-space: nowrap;
}
.salary-calc-info-value {
  color: #222;
  font-weight: 700;
  text-align: left;
  min-width: 0;
  white-space: nowrap;
}
.salary-calc-summary {
  display: flex;
  gap: 2.5rem;
  flex: 1;
}
.salary-calc-summary-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 220px;
}
.salary-calc-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  color: #1a1a1a;
  font-weight: 400;
  margin-bottom: 0.15em;
  gap: 1.5em;
  white-space: nowrap;
}
.salary-calc-summary-row b {
  font-size: 1.1rem;
  color: #4338ca;
}
.salary-calc-tabs {
  display: flex;
  gap: 2.5rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 0;
}
.salary-calc-tab {
  font-size: 1.1rem;
  color: #6c757d;
  font-weight: 500;
  padding: 0.5rem 0;
  cursor: pointer;
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.salary-calc-tab.active {
  color: #4338ca;
  border-bottom: 2px solid #4338ca;
  font-weight: 600;
}
.salary-calc-table {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 0;
}
.salary-calc-table-header {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 500;
  background: #fff;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.salary-calc-table-row {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f6f6fb;
  align-items: center;
}
.salary-calc-table-link {
  color: #4338ca;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}
.salary-calc-table-pos {
  color: #1a1a1a;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.salary-calc-table-right {
  text-align: right;
  font-weight: 600;
}
/* Salary Calc Filters: белый фон, синий бордер */
.salary-calc-filter--active {
  background: #fff !important;
  border: 1.5px solid #4338ca !important;
  box-shadow: none;
  color: #1a1a1a;
  border-radius: 8px;
  min-width: 220px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: border 0.2s;
}
.salary-calc-filter--active select,
.salary-calc-filter--active input {
  background: #fff;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #1a1a1a;
  width: 100%;
}
.salary-calc-filter-value {
  font-size: 1rem;
  color: #1a1a1a;
  margin-left: 0.5rem;
}
.salary-calc-tab-placeholder {
  width: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 1.1rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-top: 2rem;
}
.salary-calc-info--compact {
  font-size: 1rem;
  color: #444;
  min-width: 260px;
  max-width: 420px;
  margin-right: 2.5rem;
}
.salary-calc-summary--grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.2em 2.5em;
  margin-top: 1.2em;
}
.salary-calc-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  color: #1a1a1a;
  font-weight: 400;
  margin-bottom: 0.15em;
  gap: 1.5em;
  white-space: nowrap;
}
.salary-calc-summary-value {
  font-weight: 700;
  color: #222;
  margin-left: 1.5em;
  min-width: 70px;
  text-align: right;
  white-space: nowrap;
}
.salary-calc-summary-value--main {
  color: #4338ca;
  font-size: 1.08em;
  white-space: nowrap;
}
</style>