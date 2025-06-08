import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ingredients as baseIngredients } from '@/data/ingredients'

interface StorageItem {
  name: string
  quantity: number
  unit: 'шт' | 'кг' | 'л'
  total: number
}

interface StorageMovement {
  id: number
  type: 'in' | 'out'
  name: string
  quantity: string
  date: string
  total: number
}

export const useStorageStore = defineStore('storage', () => {
  // Восстановление из localStorage
  function loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw)
    } catch {}
    return fallback
  }

  // Состояние
  const items = ref<StorageItem[]>(loadFromStorage('storage_items', [
    { name: 'Курица', quantity: 42, unit: 'кг', total: 9000 },
    { name: 'Лаваш', quantity: 15, unit: 'шт', total: 1200 },
    { name: 'Помидоры', quantity: 30, unit: 'кг', total: 2100 },
    { name: 'Огурцы', quantity: 18, unit: 'кг', total: 1500 },
    { name: 'Лук', quantity: 25, unit: 'кг', total: 1100 },
    { name: 'Капуста', quantity: 12, unit: 'кг', total: 700 },
    { name: 'Морковь', quantity: 8, unit: 'кг', total: 600 },
    { name: 'Майонез', quantity: 6, unit: 'л', total: 800 },
    { name: 'Кетчуп', quantity: 7, unit: 'л', total: 700 },
    { name: 'Соус чесночный', quantity: 10, unit: 'л', total: 1200 },
    { name: 'Соус острый', quantity: 9, unit: 'л', total: 1100 },
    { name: 'Сыр', quantity: 4, unit: 'кг', total: 900 },
    { name: 'Масло растительное', quantity: 12, unit: 'л', total: 1300 },
    { name: 'Специи для курицы', quantity: 2, unit: 'кг', total: 400 },
    { name: 'Соль', quantity: 6, unit: 'кг', total: 200 },
    { name: 'Перец', quantity: 3, unit: 'кг', total: 300 },
    { name: 'Чеснок', quantity: 2, unit: 'кг', total: 250 },
    { name: 'Зелень', quantity: 5, unit: 'кг', total: 350 },
    { name: 'Картофель', quantity: 40, unit: 'кг', total: 1800 },
    { name: 'Салфетки', quantity: 50, unit: 'шт', total: 500 },
    { name: 'Упаковка малая', quantity: 20, unit: 'шт', total: 400 },
    { name: 'Упаковка большая', quantity: 10, unit: 'шт', total: 300 },
    { name: 'Стаканы', quantity: 30, unit: 'шт', total: 600 },
    { name: 'Трубочки', quantity: 40, unit: 'шт', total: 200 },
    { name: 'Пакеты', quantity: 25, unit: 'шт', total: 250 },
  ]))

  const movements = ref<StorageMovement[]>(loadFromStorage('storage_movements', [
    { id: 1, type: 'in', name: 'Курица', quantity: 'x20кг', date: '6 июня 10:15', total: 6400 },
    { id: 2, type: 'out', name: 'Лаваш', quantity: 'x5шт', date: '6 июня 18:50', total: 300 },
    { id: 3, type: 'in', name: 'Помидоры', quantity: 'x10кг', date: '7 июня 09:30', total: 900 },
    { id: 4, type: 'out', name: 'Майонез', quantity: 'x2л', date: '7 июня 15:20', total: 250 },
    { id: 5, type: 'in', name: 'Кетчуп', quantity: 'x3л', date: '8 июня 12:00', total: 400 },
    { id: 6, type: 'out', name: 'Картофель', quantity: 'x8кг', date: '8 июня 17:45', total: 350 },
    { id: 7, type: 'in', name: 'Сыр', quantity: 'x2кг', date: '9 июня 11:10', total: 700 },
    { id: 8, type: 'out', name: 'Салфетки', quantity: 'x10шт', date: '9 июня 19:00', total: 100 },
  ]))

  // Сохранять изменения в localStorage
  watch(items, val => {
    localStorage.setItem('storage_items', JSON.stringify(val))
  }, { deep: true })
  watch(movements, val => {
    localStorage.setItem('storage_movements', JSON.stringify(val))
  }, { deep: true })

  // Геттеры
  const getItemByName = (name: string) => {
    return items.value.find(item => item.name === name)
  }

  // Фильтрация по дате (день, месяц, год)
  function getMovementsByDate(selectedDate: Date) {
    const day = selectedDate.getDate()
    const month = selectedDate.getMonth()
    const year = selectedDate.getFullYear()
    return movements.value.filter(mov => {
      // mov.date: '6 июня 10:15'
      const parts = mov.date.split(' ')
      if (!parts[0] || !parts[1]) return false
      const movDay = parseInt(parts[0], 10)
      const movMonth = getMonthFromRus(parts[1])
      if (movMonth === -1) return false
      // год всегда текущий (или можно добавить в дату)
      return movDay === day && movMonth === month
    })
  }

  // Вспомогательная функция для перевода "июня" -> 5 (июнь)
  function getMonthFromRus(month: string) {
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
    return months.indexOf(month)
  }

  // Действия
  const addMovement = (
    type: 'in' | 'out',
    items: { name: string; quantity: number; unit: 'шт' | 'кг' | 'л'; price?: number }[],
    date: Date
  ) => {
    const formattedDate = formatDate(date)

    // Добавляем движения
    items.forEach(item => {
      const total = type === 'in' ? (item.price || 0) : calculateItemTotal(item.name, item.quantity)
      movements.value.push({
        id: Date.now() + Math.random(),
        type,
        name: item.name,
        quantity: `x${item.quantity}${item.unit}`,
        date: formattedDate,
        total
      })

      // Обновляем остатки
      updateItemQuantity(item.name, item.quantity, item.unit, type, total)
    })
  }

  const updateItemQuantity = (
    name: string,
    quantity: number,
    unit: 'шт' | 'кг' | 'л',
    type: 'in' | 'out',
    total: number
  ) => {
    const existingItem = getItemByName(name)
    const quantityChange = type === 'in' ? quantity : -quantity

    if (existingItem) {
      // Обновляем существующий товар
      existingItem.quantity += quantityChange
      if (type === 'in') {
        existingItem.total = total
      }
      
      // Удаляем товар, если его количество стало 0 или меньше
      if (existingItem.quantity <= 0) {
        const index = items.value.findIndex(item => item.name === name)
        if (index !== -1) {
          items.value.splice(index, 1)
        }
      }
    } else if (type === 'in') {
      // Добавляем новый товар при поставке
      items.value.push({
        name,
        quantity,
        unit,
        total
      })
    }
  }

  const calculateItemTotal = (name: string, quantity: number) => {
    const item = getItemByName(name)
    if (!item) return 0
    return Math.round(item.total * (quantity / item.quantity))
  }

  const formatDate = (date: Date) => {
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day} июня ${hours}:${minutes}`
  }

  return {
    items,
    movements,
    getMovementsByDate,
    addMovement,
    getItemByName
  }
}) 