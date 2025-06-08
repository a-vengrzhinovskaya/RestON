import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  // Состояние
  const items = ref<StorageItem[]>([
    { name: 'Курица', quantity: 89, unit: 'кг', total: 18400 },
    { name: 'Говядина', quantity: 45, unit: 'кг', total: 19780 },
    { name: 'Лаваш (арм)', quantity: 19, unit: 'шт', total: 2100 },
    { name: 'Молоко', quantity: 1.5, unit: 'л', total: 168 },
    { name: 'Кола 0.5 ПЭТ', quantity: 22, unit: 'шт', total: 4577 },
    { name: 'Спрайт 0.5 СТЕКЛО', quantity: 12, unit: 'шт', total: 4577 },
    { name: 'Влажные салфетки', quantity: 9, unit: 'шт', total: 4577 },
    { name: 'Твикс', quantity: 5, unit: 'шт', total: 4577 },
    // Страница 2
    { name: 'Помидоры', quantity: 25, unit: 'кг', total: 3750 },
    { name: 'Огурцы', quantity: 20, unit: 'кг', total: 3000 },
    { name: 'Капуста', quantity: 15, unit: 'кг', total: 900 },
    { name: 'Морковь', quantity: 10, unit: 'кг', total: 800 },
    { name: 'Лук', quantity: 30, unit: 'кг', total: 1500 },
    { name: 'Чеснок', quantity: 5, unit: 'кг', total: 1250 },
    { name: 'Картофель', quantity: 50, unit: 'кг', total: 2500 },
    { name: 'Масло подсолнечное', quantity: 20, unit: 'л', total: 2400 },
    // Страница 3
    { name: 'Соус чесночный', quantity: 15, unit: 'л', total: 3000 },
    { name: 'Соус острый', quantity: 12, unit: 'л', total: 2400 },
    { name: 'Соус кисло-сладкий', quantity: 10, unit: 'л', total: 2000 },
    { name: 'Майонез', quantity: 8, unit: 'л', total: 960 },
    { name: 'Кетчуп', quantity: 8, unit: 'л', total: 880 },
    { name: 'Горчица', quantity: 5, unit: 'л', total: 500 },
    { name: 'Специи для курицы', quantity: 3, unit: 'кг', total: 1500 },
    { name: 'Специи для говядины', quantity: 3, unit: 'кг', total: 1500 },
    // Страница 4
    { name: 'Фанта 0.5 ПЭТ', quantity: 18, unit: 'шт', total: 3780 },
    { name: 'Вода 0.5 газ', quantity: 24, unit: 'шт', total: 960 },
    { name: 'Вода 0.5 негаз', quantity: 24, unit: 'шт', total: 960 },
    { name: 'Чай черный', quantity: 100, unit: 'шт', total: 500 },
    { name: 'Чай зеленый', quantity: 100, unit: 'шт', total: 500 },
    { name: 'Кофе зерновой', quantity: 5, unit: 'кг', total: 3500 },
    { name: 'Молоко для кофе', quantity: 10, unit: 'л', total: 800 },
    { name: 'Сливки для кофе', quantity: 5, unit: 'л', total: 750 }
  ])

  const movements = ref<StorageMovement[]>([
    { id: 1, type: 'in', name: 'Курица', quantity: 'x20кг', date: '11 июня 13:08', total: 6400 },
    { id: 2, type: 'in', name: 'Говядина', quantity: 'x40кг', date: '9 июня 16:34', total: 19250 },
    { id: 3, type: 'out', name: 'Молоко', quantity: 'x2л', date: '6 июня 18:50', total: 210 }
  ])

  // Геттеры
  const getItemByName = (name: string) => {
    return items.value.find(item => item.name === name)
  }

  const filteredMovements = computed(() => {
    // Здесь можно добавить фильтрацию по дате
    return movements.value
  })

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
    filteredMovements,
    addMovement,
    getItemByName
  }
}) 