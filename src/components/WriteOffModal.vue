<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Списание от</h3>
        <div class="date-display">
          <span class="calendar-icon">📅</span>
          {{ formatDate(date) }}
        </div>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="form-content">
        <div class="form-header">
          <div class="column">ПОЗИЦИИ</div>
          <div class="column">КОЛИЧЕСТВО</div>
        </div>

        <div class="form-rows">
          <div v-for="(item, index) in selectedItems" :key="index" class="form-row">
            <div class="input-group">
              <select v-model="item.name" @change="updateUnit(index, item.name)">
                <option value="" disabled>Выберите позицию</option>
                <option v-for="ing in availableItems" :key="ing.name" :value="ing.name">{{ ing.name }}</option>
              </select>
            </div>
            <div class="input-group quantity">
              <input type="number" v-model.number="item.quantity" :max="getMaxQuantity(item.name) ?? undefined" min="0" :placeholder="getMaxQuantity(item.name) ? '0 - ' + getMaxQuantity(item.name) : '0'" />
              <span class="unit-label">{{ getUnit(item.name) }}</span>
            </div>
            <button class="delete-btn" @click="removeItem(index)">
              <span class="material-icons delete-icon">delete</span>
            </button>
          </div>
        </div>

        <button class="add-field-btn" @click="addItem">+ Добавить поле</button>

        <div class="form-footer">
          <div class="total">
            Итого: <span class="amount">{{ formatTotal }}</span>
          </div>
          <button class="save-btn" @click="save">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStorageStore } from '@/stores/storage'

const props = defineProps<{
  isOpen: boolean
  date: Date
  ingredientsList: Array<{ name: string; unit: string }>
}>()

const emit = defineEmits(['update:isOpen', 'save'])

const store = useStorageStore()

// Список всех доступных ингредиентов
const availableItems = computed(() => props.ingredientsList)

// Выбранные элементы для списания
const selectedItems = ref<{
  name: string
  quantity: number
  unit: 'шт' | 'кг' | 'л'
}[]>([{ name: '', quantity: 0, unit: 'шт' }])

// Вычисление общей суммы
const totalAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    if (!item.name || !item.quantity) return total
    const storeItem = store.getItemByName(item.name)
    if (!storeItem) return total
    return total + (item.quantity * (storeItem.total / storeItem.quantity))
  }, 0)
})

// Добавление нового элемента
const addItem = () => {
  selectedItems.value.push({ name: '', quantity: 0, unit: 'шт' })
}

// Удаление элемента
const removeItem = (index: number) => {
  if (selectedItems.value.length > 1) {
    selectedItems.value.splice(index, 1)
  }
}

// Обновление единицы измерения при выборе товара
const updateUnit = (index: number, itemName: string) => {
  const item = props.ingredientsList.find(i => i.name === itemName)
  if (item) {
    selectedItems.value[index].unit = item.unit as 'шт' | 'кг' | 'л'
  }
}

// Сохранение списания
const handleSave = () => {
  emit('save', {
    items: selectedItems.value.filter(item => item.name && item.quantity > 0),
    date: props.date
  })
}

const handleClose = () => {
  emit('update:isOpen', false)
  selectedItems.value = [{ name: '', quantity: 0, unit: 'шт' }]
}

const formatDate = (date: Date) => {
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day} июня ${hours}:${minutes}`
}

const formatTotal = computed(() => {
  return `-${totalAmount.value} ₽`
})

const closeModal = () => {
  handleClose()
}

const save = () => {
  handleSave()
}

// Получить максимальное количество для списания по названию
function getMaxQuantity(name: string): number | null {
  return null
}

// Получить единицу измерения по названию
function getUnit(name: string): string {
  const found = props.ingredientsList.find(i => i.name === name)
  return found ? found.unit : ''
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
  width: 600px;
  max-width: 90vw;
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #4338ca;
  border-radius: 6px;
  color: #1a1a1a;
  font-size: 0.875rem;
}

.calendar-icon {
  color: #4338ca;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
}

.form-content {
  padding: 1.5rem;
}

.form-header {
  display: grid;
  grid-template-columns: 1fr 200px 40px;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.form-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 200px 40px;
  gap: 1rem;
  align-items: center;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.input-group.quantity {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

.unit-select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  color: #1a1a1a;
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
}

.trash-icon {
  font-size: 1.1rem;
}

.add-field-btn {
  background: none;
  border: none;
  color: #4338ca;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.total {
  font-size: 0.875rem;
  color: #374151;
}

.amount {
  font-weight: 600;
  color: #111827;
}

.save-btn {
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.save-btn:hover {
  opacity: 0.9;
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

.unit-label {
  margin-left: 0.5em;
  color: #6B7280;
  font-size: 0.95em;
  min-width: 2em;
  display: inline-block;
}

/* Селектор ингредиента как input */
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #fff;
  color: #1a1a1a;
  outline: none;
  box-sizing: border-box;
  transition: border 0.2s;
  height: 44px;
  appearance: none;
}
.input-group select:focus {
  border-color: #4338ca;
}
.input-group select::-ms-expand {
  display: none;
}
</style> 