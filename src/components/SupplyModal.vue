<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Поставка</h2>
        <div class="date-display">
          <span class="calendar-icon">📅</span>
          {{ formatDate(date) }}
        </div>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-rows">
          <div v-for="(item, index) in selectedItems" :key="index" class="form-row">
            <div class="input-group">
              <input type="text" v-model="item.name" placeholder="Название" @change="updateUnit(index, item.name)" />
            </div>
            <div class="input-group quantity">
              <input type="number" v-model="item.quantity" placeholder="0" />
              <select v-model="item.unit" class="unit-select">
                <option value="шт">шт</option>
                <option value="кг">кг</option>
                <option value="л">л</option>
              </select>
            </div>
            <div class="input-group price">
              <input type="number" v-model="item.price" placeholder="0" />
              <span class="currency">₽</span>
            </div>
            <button class="remove-btn" @click="removeItem(index)" v-if="selectedItems.length > 1">×</button>
          </div>
        </div>
        <button class="add-btn" @click="addItem">+ Добавить</button>
      </div>
      <div class="modal-footer">
        <div class="total">Итого: {{ formatTotal }}</div>
        <div class="actions">
          <button class="cancel-btn" @click="handleClose">Отмена</button>
          <button class="save-btn" @click="handleSave">Сохранить</button>
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
  width: 800px;
  max-width: 90vw;
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
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

.modal-body {
  padding: 1.5rem;
}

.form-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 200px 150px 40px;
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

.input-group.price {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

.currency {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
}

.add-btn {
  background: none;
  border: none;
  color: #4338ca;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
}

.modal-footer {
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

.actions {
  display: flex;
  gap: 0.75rem;
}

.cancel-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
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
</style> 