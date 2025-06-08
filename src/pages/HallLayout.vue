<template>
  <div class="hall-layout">
    <div class="hall-main">
      <div class="hall-floor-tabs" style="margin-bottom: 1.5rem;">
        <button v-for="(hall, idx) in halls" :key="hall.name" class="floor-tab" :class="{ active: currentHallIdx === idx }"
          @click="selectHall(idx)"
          @dblclick="startRenameHall(idx, hall.name)"
        >
          <template v-if="renameHallIdx === idx">
            <input
              v-model="renameHallValue"
              ref="renameInputRef"
              class="rename-input"
              @blur="finishRenameHall"
              @keydown.enter.prevent="finishRenameHall"
              @keydown.esc.prevent="cancelRenameHall"
            />
          </template>
          <template v-else>
            {{ hall.name }}
          </template>
        </button>
        <button class="add-floor" @click="addHall">+ Добавить зал</button>
      </div>
      <div v-if="halls.length && halls[currentHallIdx]" class="hall-canvas" ref="canvasRef">
        <div
          v-for="table in halls[currentHallIdx].tables"
          :key="table.id"
          class="table-item"
          :style="{
            left: table.x + 'px',
            top: table.y + 'px',
            ...getTableShapeStyle(table.shape),
            width: getTableSize(table.shape).width + 'px',
            height: getTableSize(table.shape).height + 'px',
            background: table.color,
            zIndex: draggingId === table.id ? 2 : 1
          }"
          @mousedown="startDrag(table, $event)"
        >
          <!-- Диваны -->
          <img v-for="(pos, idx) in getObjectPositions(table, 'sofa')"
               :key="'sofa'+idx"
               :src="sofaImg"
               class="sofa-img"
               :style="{ left: pos.left + 'px', top: pos.top + 'px', width: getTableSize(table.shape).width + 'px', height: '40px', transform: getSofaTransform(pos.side) }"
          />
          <!-- Кресла или стулья -->
          <img v-for="(pos, idx) in getObjectPositions(table, table.armchairs > 0 ? 'armchair' : 'chair')"
               :key="(table.armchairs > 0 ? 'armchair' : 'chair')+idx"
               :src="chairImg"
               class="chair-img"
               :style="{ left: pos.left + 'px', top: pos.top + 'px', width: (getTableSize(table.shape).width/2) + 'px', height: '32px', transform: getChairRotate(pos.side) }"
          />
          <div class="table-label">{{ table.name }}</div>
          <div class="table-tags">
            <span v-for="(tag, i) in table.tags" :key="i" class="table-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="hall-sidebar">
      <div v-if="halls.length && halls[currentHallIdx]" class="sidebar-card">
        <h3>Добавление стола</h3>
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.name" type="text" placeholder="1 стол" />
        </div>
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="form.description" placeholder="Описание"></textarea>
        </div>
        <div class="form-group">
          <label>Теги</label>
          <div class="tags-input">
            <span v-for="(tag, idx) in form.tags" :key="tag" class="tag-chip">
              {{ tag }} <span class="remove-tag" @click="removeTag(idx)">&times;</span>
            </span>
            <input v-model="form.tagInput" @keydown.enter.prevent="addTag" placeholder="Новый тег" />
            <button class="add-tag-btn" @click="addTag">+</button>
          </div>
        </div>
        <div class="form-group">
          <label>Количество мест</label>
          <div class="counter">
            <button @click="form.seats = Math.max(1, form.seats - 1)">-</button>
            <span>{{ form.seats }}</span>
            <button @click="form.seats++">+</button>
          </div>
        </div>
        <div class="form-group">
          <label>Объекты вокруг стола</label>
          <div class="counter-row">
            <span class="object-label">Диванов</span>
            <button @click="form.sofas = Math.max(0, form.sofas - 1)">-</button>
            <span>{{ form.sofas }}</span>
            <button @click="form.sofas++">+</button>
          </div>
          <div class="counter-row">
            <span class="object-label">Кресел</span>
            <button @click="form.armchairs = Math.max(0, form.armchairs - 1)">-</button>
            <span>{{ form.armchairs }}</span>
            <button @click="form.armchairs++">+</button>
          </div>
          <div class="counter-row">
            <span class="object-label">Стульев</span>
            <button @click="form.chairs = Math.max(0, form.chairs - 1)">-</button>
            <span>{{ form.chairs }}</span>
            <button @click="form.chairs++">+</button>
          </div>
        </div>
        <div class="form-group">
          <label>Форма стола</label>
          <div class="shape-select">
            <button v-for="shape in shapes" :key="shape.value" :class="['shape-btn', { active: form.shape === shape.value }]" @click="form.shape = shape.value">
              <span :class="'shape-' + shape.value"></span>
            </button>
          </div>
        </div>
        <div class="form-actions">
          <button class="cancel-btn" @click="resetForm">Отменить</button>
          <button class="add-btn" @click="addTable">Добавить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import sofaImg from '@/assets/sofa.png'
import chairImg from '@/assets/chair.png'

interface Table {
  id: number
  name: string
  description: string
  seats: number
  sofas: number
  armchairs: number
  chairs: number
  shape: string
  tags: string[]
  x: number
  y: number
  color: string
}
interface Hall {
  name: string
  tables: Table[]
}

const halls = ref<Hall[]>([])
const currentHallIdx = ref(0)
const draggingId = ref<number|null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const canvasRef = ref<HTMLElement|null>(null)

const form = reactive({
  name: '',
  description: '',
  seats: 1,
  sofas: 0,
  armchairs: 0,
  chairs: 0,
  shape: 'rect',
  tags: [] as string[],
  tagInput: '',
})

const shapes = [
  { value: 'rect', label: 'Прямоугольник' },
  { value: 'rounded', label: 'Скругл.' },
  { value: 'oval', label: 'Овал' },
  { value: 'circle', label: 'Круг' },
]

const renameHallIdx = ref<number|null>(null)
const renameHallValue = ref('')
const renameInputRef = ref<HTMLInputElement|null>(null)

// --- LocalStorage ---
const STORAGE_KEY = 'reston_halls_v1'
function saveHalls() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(halls.value))
}
function loadHalls() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        halls.value = parsed
      }
    } catch {}
  }
  if (halls.value.length === 0) {
    halls.value = [{ name: 'Этаж 1', tables: [] }]
  }
  if (currentHallIdx.value >= halls.value.length) {
    currentHallIdx.value = 0
  }
}

onMounted(() => {
  loadHalls()
})

watch(halls, saveHalls, { deep: true })

// --- Ограничения на выбор сидений ---
watch(() => [form.sofas, form.armchairs, form.chairs, form.shape], () => {
  if (form.shape === 'circle') {
    form.sofas = 0
  }
  if (form.sofas > 2) form.sofas = 2
  if (form.sofas === 2) {
    form.armchairs = 0
    form.chairs = 0
  }
  if (form.sofas === 1) {
    if (form.armchairs > 2) form.armchairs = 2
    if (form.chairs > 2) form.chairs = 2
    if (form.armchairs + form.chairs > 2) {
      if (form.armchairs >= form.chairs) form.armchairs = 2 - form.chairs
      else form.chairs = 2 - form.armchairs
    }
  }
  if (form.sofas === 0) {
    if (form.armchairs > 4) form.armchairs = 4
    if (form.chairs > 4) form.chairs = 4
    if (form.armchairs + form.chairs > 4) {
      if (form.armchairs >= form.chairs) form.armchairs = 4 - form.chairs
      else form.chairs = 4 - form.armchairs
    }
  }
})

function addTable() {
  const hall = halls.value[currentHallIdx.value]
  hall.tables.push({
    id: Date.now(),
    name: form.name || `Стол ${hall.tables.length + 1}`,
    description: form.description,
    seats: form.seats,
    sofas: form.sofas,
    armchairs: form.armchairs,
    chairs: form.chairs,
    shape: form.shape,
    tags: [...form.tags],
    x: 60 + Math.random() * 200,
    y: 60 + Math.random() * 200,
    color: '#e0e7ff',
  })
  resetForm()
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.seats = 1
  form.sofas = 0
  form.armchairs = 0
  form.chairs = 0
  form.shape = 'rect'
  form.tags = []
  form.tagInput = ''
}

function addTag() {
  const tag = form.tagInput.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  form.tagInput = ''
}
function removeTag(idx: number) {
  form.tags.splice(idx, 1)
}

function addHall() {
  const num = halls.value.length + 1
  let name = `Этаж ${num}`
  let i = num
  while (halls.value.find(h => h.name === name)) {
    i++
    name = `Этаж ${i}`
  }
  halls.value.push({ name, tables: [] })
  currentHallIdx.value = halls.value.length - 1
}

function selectHall(idx: number) {
  currentHallIdx.value = idx
}

let dragTable: any = null

function startDrag(table: any, e: MouseEvent) {
  draggingId.value = table.id
  dragTable = table
  dragOffset.value = {
    x: e.clientX - table.x,
    y: e.clientY - table.y,
  }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!dragTable) return
  const canvas = canvasRef.value
  const shape = dragTable.shape
  const { width, height } = getTableSize(shape)
  let newX = e.clientX - dragOffset.value.x
  let newY = e.clientY - dragOffset.value.y
  if (canvas) {
    const rect = canvas.getBoundingClientRect()
    newX = Math.max(0, Math.min(newX, rect.width - width))
    newY = Math.max(0, Math.min(newY, rect.height - height))
  }
  dragTable.x = newX
  dragTable.y = newY
}

function stopDrag() {
  draggingId.value = null
  dragTable = null
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

function getTableShapeStyle(shape: string) {
  switch (shape) {
    case 'rect':
      return { borderRadius: '12px' }
    case 'rounded':
      return { borderRadius: '32px' }
    case 'oval':
      return { borderRadius: '50% / 40%' }
    case 'circle':
      return { borderRadius: '50%', width: '80px', height: '80px' }
    default:
      return { borderRadius: '12px' }
  }
}

function getTableSize(shape: string) {
  if (shape === 'circle') return { width: 80, height: 80 }
  return { width: 120, height: 80 }
}

function getObjectPositions(table: any, type: 'sofa'|'chair'|'armchair') {
  const { shape } = table
  const { width: tableW, height: tableH } = getTableSize(shape)
  const sides = ['top', 'bottom', 'left', 'right']
  const result: { left: number, top: number, rotate: number, side: string }[] = []
  let sofas = (shape === 'circle') ? 0 : Math.min(2, table.sofas)
  let armchairs = Math.min(4 - sofas, table.armchairs)
  let chairs = Math.min(4 - sofas, table.chairs)
  let sofaSides: string[] = []
  let armchairSides: string[] = []
  let chairSides: string[] = []
  if (sofas === 2) sofaSides = ['top', 'bottom']
  else if (sofas === 1) sofaSides = ['top']
  if (type === 'armchair') armchairSides = sides.filter(s => !sofaSides.includes(s)).slice(0, armchairs)
  if (type === 'chair') chairSides = sides.filter(s => !sofaSides.includes(s)).slice(0, armchairs === 0 ? chairs : 0)
  if (type === 'sofa') {
    sofaSides.forEach(side => {
      if (side === 'top') result.push({ left: 0, top: -44, rotate: 0, side })
      if (side === 'bottom') result.push({ left: 0, top: tableH, rotate: 180, side })
    })
  }
  if (type === 'armchair') {
    armchairSides.forEach(side => {
      if (side === 'top') result.push({ left: tableW/4, top: -36, rotate: 0, side })
      if (side === 'bottom') result.push({ left: tableW/4, top: tableH + 4, rotate: 180, side })
      if (side === 'left') result.push({ left: -tableW/2 + 8, top: tableH/2 - 16, rotate: 90, side })
      if (side === 'right') result.push({ left: tableW - 8, top: tableH/2 - 16, rotate: -90, side })
    })
  }
  if (type === 'chair') {
    chairSides.forEach(side => {
      if (side === 'top') result.push({ left: tableW/4, top: -36, rotate: 0, side })
      if (side === 'bottom') result.push({ left: tableW/4, top: tableH + 4, rotate: 180, side })
      if (side === 'left') result.push({ left: -tableW/2 + 8, top: tableH/2 - 16, rotate: 90, side })
      if (side === 'right') result.push({ left: tableW - 8, top: tableH/2 - 16, rotate: -90, side })
    })
  }
  return result
}

function getChairRotate(side: string) {
  if (side === 'top') return 'rotate(180deg)'
  if (side === 'bottom') return 'rotate(0deg)'
  if (side === 'left') return 'rotate(90deg)'
  if (side === 'right') return 'rotate(-90deg)'
  return ''
}
function getSofaTransform(side: string) {
  if (side === 'bottom') return 'scaleY(-1)';
  return '';
}

function startRenameHall(idx: number, name: string) {
  renameHallIdx.value = idx
  renameHallValue.value = name
  nextTick(() => {
    renameInputRef.value?.focus()
    renameInputRef.value?.select()
  })
}
function finishRenameHall() {
  if (renameHallIdx.value !== null && renameHallValue.value.trim()) {
    halls.value[renameHallIdx.value].name = renameHallValue.value.trim()
    renameHallIdx.value = null
    renameHallValue.value = ''
  }
}
function cancelRenameHall() {
  renameHallIdx.value = null
  renameHallValue.value = ''
}
</script>

<style scoped>
.hall-layout {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}
.hall-main {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 700px;
}
.hall-canvas {
  flex: 1 1 0;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  min-height: 600px;
  position: relative;
  margin-bottom: 1.5rem;
}
.table-item {
  position: absolute;
  border-radius: 16px;
  background: #e0e7ff;
  box-shadow: 0 2px 8px 0 #0001;
  cursor: grab;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1rem;
  transition: box-shadow 0.2s;
  overflow: visible;
  flex-direction: column;
}
.table-item:active {
  cursor: grabbing;
  box-shadow: 0 4px 16px 0 #0002;
}
.sofa-img {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}
.chair-img {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}
.table-label {
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 600;
  z-index: 3;
  position: relative;
}
.table-tags {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}
.table-tag {
  background: #fde68a;
  color: #b45309;
  font-size: 0.75rem;
  border-radius: 6px;
  padding: 0.1rem 0.5rem;
  font-weight: 500;
}
.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}
.tag-chip {
  background: #fde68a;
  color: #b45309;
  font-size: 0.8rem;
  border-radius: 6px;
  padding: 0.1rem 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.remove-tag {
  margin-left: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
}
.add-tag-btn {
  background: #fde68a;
  color: #b45309;
  border: none;
  border-radius: 6px;
  padding: 0.1rem 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}
.hall-floor-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.floor-tab {
  background: #ede9fe;
  color: #4338ca;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
}
.floor-tab.active {
  background: #a5b4fc;
  color: #fff;
}
.add-floor {
  background: #fff;
  color: #4338ca;
  border: 1px solid #4338ca;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
}
.hall-sidebar {
  width: 350px;
  min-width: 320px;
}
.sidebar-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #0001;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-group label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}
input, textarea {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  background: #f8f9fa;
}
textarea {
  min-height: 48px;
  resize: vertical;
}
.counter, .counter-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.counter button, .counter-row button {
  background: #ede9fe;
  color: #4338ca;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  cursor: pointer;
}
.counter button:active, .counter-row button:active {
  background: #a5b4fc;
  color: #fff;
}
.shape-select {
  display: flex;
  gap: 0.5rem;
}
.shape-btn {
  background: #ede9fe;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.shape-btn.active {
  background: #4338ca;
}
.shape-btn .shape-rect {
  width: 22px;
  height: 14px;
  background: #4338ca;
  border-radius: 4px;
}
.shape-btn.active .shape-rect {
  background: #fff;
}
.shape-btn .shape-rounded {
  width: 22px;
  height: 14px;
  background: #4338ca;
  border-radius: 10px;
}
.shape-btn.active .shape-rounded {
  background: #fff;
}
.shape-btn .shape-oval {
  width: 22px;
  height: 14px;
  background: #4338ca;
  border-radius: 50% / 40%;
}
.shape-btn.active .shape-oval {
  background: #fff;
}
.shape-btn .shape-circle {
  width: 18px;
  height: 18px;
  background: #4338ca;
  border-radius: 50%;
}
.shape-btn.active .shape-circle {
  background: #fff;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
.cancel-btn {
  background: #ede9fe;
  color: #4338ca;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
}
.add-btn {
  background: #4338ca;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
}
.rename-input {
  font-size: 1rem;
  border: 1px solid #a5b4fc;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  min-width: 70px;
  outline: none;
}
.counter-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: flex-end;
}
.object-label {
  margin-right: auto;
  font-size: 1rem;
  color: #1a1a1a;
  min-width: 50px;
  text-align: left;
}
</style>