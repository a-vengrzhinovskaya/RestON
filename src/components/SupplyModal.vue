<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Поставка от</h3>
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
          <div class="column">СТОИМОСТЬ</div>
        </div>
        <div class="form-rows">
          <div v-for="(item, index) in selectedItems" :key="index" class="form-row">
            <div class="input-group">
              <select v-model="item.name" @change="updateUnit(index, item.name)">
                <option value="" disabled>Выберите позицию</option>
                <option v-for="storeItem in availableItems" :key="storeItem.name" :value="storeItem.name">{{ storeItem.name }}</option>
              </select>
            </div>
            <div class="input-group quantity">
              <input type="number" v-model.number="item.quantity" min="0" placeholder="0" />
              <span class="unit-label">{{ getUnit(item.name) }}</span>
            </div>
            <div class="input-group price">
              <input type="number" v-model.number="item.price" min="0" placeholder="0" inputmode="decimal" style="appearance: textfield;" />
              <span class="unit-label">₽</span>
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
}>()

const emit = defineEmits(['update:isOpen', 'save'])

const store = useStorageStore()

// Список всех доступных ингредиентов
const availableItems = computed(() => store.items)

// Выбранные элементы для поставки
const selectedItems = ref<{
  name: string
  quantity: number
  unit: 'шт' | 'кг' | 'л'
  price: number
}[]>([{ name: '', quantity: 0, unit: 'шт', price: 0 }])

// Вычисление общей суммы
const totalAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    if (!item.name || !item.quantity || !item.price) return total
    return total + (item.quantity * item.price)
  }, 0)
})

// Добавление нового элемента
const addItem = () => {
  selectedItems.value.push({ name: '', quantity: 0, unit: 'шт', price: 0 })
}

// Удаление элемента
const removeItem = (index: number) => {
  if (selectedItems.value.length > 1) {
    selectedItems.value.splice(index, 1)
  }
}

// Обновление единицы измерения при выборе товара
const updateUnit = (index: number, itemName: string) => {
  const item = store.getItemByName(itemName)
  if (item) {
    selectedItems.value[index].unit = item.unit
  }
}

// Получить единицу измерения по названию
function getUnit(name: string): string {
  const found = store.getItemByName(name)
  return found ? found.unit : ''
}

// Сохранение поставки
const handleSave = () => {
  emit('save', {
    items: selectedItems.value.filter(item => item.name && item.quantity > 0 && item.price > 0),
    date: props.date
  })
}

const handleClose = () => {
  emit('update:isOpen', false)
  selectedItems.value = [{ name: '', quantity: 0, unit: 'шт', price: 0 }]
}

const formatDate = (date: Date) => {
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day} июня ${hours}:${minutes}`
}

const formatTotal = computed(() => {
  const total = totalAmount.value
  return `${total} ₽`
})

const closeModal = () => {
  handleClose()
}

const save = () => {
  handleSave()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
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
  width: 700px;
  max-width: 95vw;
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
  grid-template-columns: 1fr 200px 120px 40px;
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
  grid-template-columns: 1fr 200px 120px 40px;
  gap: 1rem;
  align-items: center;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}
.input-group input, .input-group select {
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
  display: block;
}
.input-group input:focus, .input-group select:focus {
  border-color: #4338ca;
}
.input-group input::-ms-expand, .input-group select::-ms-expand {
  display: none;
}
/* Для выравнивания селектора с input */
.input-group select {
  margin: 0;
}
/* Значок рубля внутри поля стоимости */
.input-group.price {
  position: relative;
  display: flex;
  align-items: center;
}
.input-group.price input {
  padding-right: 2.2em;
}
.input-group.price .unit-label {
  position: absolute;
  right: 0.9em;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  color: #6B7280;
  font-size: 0.95em;
  min-width: 1.5em;
  pointer-events: none;
  display: block;
}
.unit-label {
  margin-left: 0.5em;
  color: #6B7280;
  font-size: 0.95em;
  min-width: 2em;
  display: inline-block;
}
.delete-btn {
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;
  padding: 0.5rem;
}
.delete-btn:hover {
  color: #ef4444;
}
.add-field-btn {
  background: none;
  border: none;
  color: #4338ca;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  transition: color 0.2s;
}
.add-field-btn:hover {
  color: #3730a3;
}
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
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
.save-btn:hover {
  background: #3730a3;
}
/* Убрать стрелки у input[type=number] для стоимости */
.input-group.price input[type=number]::-webkit-outer-spin-button,
.input-group.price input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-group.price input[type=number] {
  -moz-appearance: textfield;
}
</style> 