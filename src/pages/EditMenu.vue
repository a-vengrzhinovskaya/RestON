<template>
  <div class="edit-menu">
    <h1 class="page-title">Изменить меню</h1>

    <div class="menu-sections">
      <!-- Ingredients section -->
      <section class="menu-section">
        <div class="section-header">
          <h2>Ингредиенты</h2>
        </div>
        <p class="section-description">То, из чего состоят позиции в меню</p>
        
        <div class="table">
          <div class="table-header">
            <div class="header-cell">НАЗВАНИЕ</div>
            <div class="header-cell">ЕДИНИЦА ИЗМЕРЕНИЯ</div>
          </div>
          <div class="table-body">
            <div v-for="(ingredient, index) in paginatedIngredients" :key="index" class="table-row">
              <div class="cell">{{ ingredient.name }}</div>
              <div class="cell">{{ ingredient.unit }}</div>
            </div>
            <div v-for="i in (8 - paginatedIngredients.length)" :key="`empty-${i}`" class="empty-row"></div>
          </div>
        </div>
        <div class="table-footer">
          <div class="footer-content">
            <div class="pagination">
              <button 
                class="pagination-arrow" 
                :disabled="currentPage.ingredients.value === 1"
                @click="currentPage.ingredients.value--"
              >
                &lt;
              </button>
              <span class="page-info">{{ currentPage.ingredients.value }}/{{ ingredientsTotalPages }}</span>
              <button 
                class="pagination-arrow" 
                :disabled="currentPage.ingredients.value === ingredientsTotalPages"
                @click="currentPage.ingredients.value++"
              >
                &gt;
              </button>
            </div>
            <button class="add-button" @click="showIngredientModal = true">Добавить</button>
          </div>
        </div>
      </section>

      <!-- Positions section -->
      <section class="menu-section">
        <div class="section-header">
          <h2>Позиции</h2>
        </div>
        <p class="section-description">Карточки товаров в пользовательском приложении для официантов</p>
        
        <div class="table">
          <div class="table-header">
            <div class="header-cell">НАЗВАНИЕ</div>
            <div class="header-cell">КАТЕГОРИЯ</div>
            <div class="header-cell">СТОИМОСТЬ</div>
          </div>
          <div class="table-body">
            <div v-for="(position, index) in paginatedPositions" :key="index" class="table-row">
              <div class="cell">{{ position.name }}</div>
              <div class="cell">{{ position.category }}</div>
              <div class="cell">{{ position.price > 0 ? `${position.price} ₽` : '' }}</div>
            </div>
            <div v-for="i in (8 - paginatedPositions.length)" :key="`empty-${i}`" class="empty-row"></div>
          </div>
        </div>
        <div class="table-footer">
          <div class="footer-content">
            <div class="pagination">
              <button 
                class="pagination-arrow" 
                :disabled="currentPage.positions.value === 1"
                @click="currentPage.positions.value--"
              >
                &lt;
              </button>
              <span class="page-info">{{ currentPage.positions.value }}/{{ positionsTotalPages }}</span>
              <button 
                class="pagination-arrow" 
                :disabled="currentPage.positions.value === positionsTotalPages"
                @click="currentPage.positions.value++"
              >
                &gt;
              </button>
            </div>
            <button class="add-button" @click="showPositionModal = true">Добавить</button>
          </div>
        </div>
      </section>

      <!-- Categories section -->
      <section class="menu-section">
        <div class="section-header">
          <h2>Категории</h2>
        </div>
        <p class="section-description">Группировка позиций в пользовательском приложении</p>
        
        <div class="table">
          <div class="table-header">
            <div class="header-cell">НАЗВАНИЕ</div>
          </div>
          <div class="table-body">
            <div v-for="(category, index) in paginatedCategories" :key="index" class="table-row">
              <div class="cell">{{ category.name }}</div>
            </div>
            <div v-for="i in (8 - paginatedCategories.length)" :key="`empty-${i}`" class="empty-row"></div>
          </div>
        </div>
        <div class="table-footer">
          <div class="footer-content">
            <div class="pagination">
              <button 
                class="pagination-arrow" 
                :disabled="currentPage.categories.value === 1"
                @click="currentPage.categories.value--"
              >
                &lt;
              </button>
              <span class="page-info">{{ currentPage.categories.value }}/{{ categoriesTotalPages }}</span>
              <button 
                class="pagination-arrow" 
                :disabled="currentPage.categories.value === categoriesTotalPages"
                @click="currentPage.categories.value++"
              >
                &gt;
              </button>
            </div>
            <button class="add-button" @click="showCategoryModal = true">Добавить</button>
          </div>
        </div>
      </section>
    </div>

    <!-- Модальные окна -->
    <AddIngredientModal
      v-model="showIngredientModal"
      @save="handleSaveIngredients"
    />
    
    <AddPositionModal
      v-model="showPositionModal"
      :categories="categories.map(c => c.name)"
      @save="handleSavePositions"
    />
    
    <AddCategoryModal
      v-model="showCategoryModal"
      @save="handleSaveCategories"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AddIngredientModal from '@/components/AddIngredientModal.vue'
import AddPositionModal from '@/components/AddPositionModal.vue'
import AddCategoryModal from '@/components/AddCategoryModal.vue'

const ITEMS_PER_PAGE = 8

// Модальные окна
const showIngredientModal = ref(false)
const showPositionModal = ref(false)
const showCategoryModal = ref(false)

interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

interface Position {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface Category {
  id: number;
  name: string;
}

// Данные таблиц
const ingredients = ref<Ingredient[]>([
  { id: 1, name: 'Курица', unit: 'кг' },
  { id: 2, name: 'Лаваш', unit: 'шт' },
  { id: 3, name: 'Помидоры', unit: 'кг' },
  { id: 4, name: 'Огурцы', unit: 'кг' },
  { id: 5, name: 'Лук', unit: 'кг' },
  { id: 6, name: 'Капуста', unit: 'кг' },
  { id: 7, name: 'Морковь', unit: 'кг' },
  { id: 8, name: 'Майонез', unit: 'л' },
  { id: 9, name: 'Кетчуп', unit: 'л' },
  { id: 10, name: 'Соус чесночный', unit: 'л' },
  { id: 11, name: 'Соус острый', unit: 'л' },
  { id: 12, name: 'Сыр', unit: 'кг' },
  { id: 13, name: 'Масло растительное', unit: 'л' },
  { id: 14, name: 'Специи для курицы', unit: 'кг' },
  { id: 15, name: 'Соль', unit: 'кг' },
  { id: 16, name: 'Перец', unit: 'кг' },
  { id: 17, name: 'Чеснок', unit: 'кг' },
  { id: 18, name: 'Зелень', unit: 'кг' },
  { id: 19, name: 'Картофель', unit: 'кг' },
  { id: 20, name: 'Салфетки', unit: 'шт' },
  { id: 21, name: 'Упаковка малая', unit: 'шт' },
  { id: 22, name: 'Упаковка большая', unit: 'шт' },
  { id: 23, name: 'Стаканы', unit: 'шт' },
  { id: 24, name: 'Трубочки', unit: 'шт' },
  { id: 25, name: 'Пакеты', unit: 'шт' },
])

const categories = ref<Category[]>([
  { id: 1, name: 'Шаурма' },
  { id: 2, name: 'Напитки' },
  { id: 3, name: 'Закуски' },
  { id: 4, name: 'Гарниры' },
  { id: 5, name: 'Салаты' },
  { id: 6, name: 'Соусы' },
  { id: 7, name: 'Десерты' },
  { id: 8, name: 'Комбо' },
  { id: 9, name: 'Добавки' },
])

const positions = ref<Position[]>([
  { id: 1, name: 'Шаурма классическая', category: 'Шаурма', price: 200 },
  { id: 2, name: 'Кока-кола', category: 'Напитки', price: 100 },
  { id: 3, name: 'Шаурма острая', category: 'Шаурма', price: 220 },
  { id: 4, name: 'Шаурма с сыром', category: 'Шаурма', price: 250 },
  { id: 5, name: 'Фанта', category: 'Напитки', price: 100 },
  { id: 6, name: 'Спрайт', category: 'Напитки', price: 100 },
  { id: 7, name: 'Картофель фри', category: 'Гарниры', price: 150 },
  { id: 8, name: 'Картофель по-деревенски', category: 'Гарниры', price: 170 },
  { id: 9, name: 'Салат Цезарь', category: 'Салаты', price: 180 },
  { id: 10, name: 'Салат овощной', category: 'Салаты', price: 150 },
  { id: 11, name: 'Соус чесночный', category: 'Соусы', price: 50 },
  { id: 12, name: 'Соус острый', category: 'Соусы', price: 50 },
  { id: 13, name: 'Комбо №1', category: 'Комбо', price: 400 },
  { id: 14, name: 'Комбо №2', category: 'Комбо', price: 450 },
  { id: 15, name: 'Сыр', category: 'Добавки', price: 50 },
  { id: 16, name: 'Двойное мясо', category: 'Добавки', price: 150 },
  { id: 17, name: 'Морс', category: 'Напитки', price: 80 },
  { id: 18, name: 'Чай', category: 'Напитки', price: 50 },
  { id: 19, name: 'Кофе', category: 'Напитки', price: 100 },
])

// Пагинация
const currentPage = {
  ingredients: ref(1),
  positions: ref(1),
  categories: ref(1)
};

const ingredientsTotalPages = computed(() => Math.ceil(ingredients.value.length / ITEMS_PER_PAGE))
const paginatedIngredients = computed(() => {
  const start = (currentPage.ingredients.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const items = ingredients.value.slice(start, end);
  
  while (items.length < ITEMS_PER_PAGE) {
    items.push({ id: 0, name: '', unit: '' });
  }
  
  return items;
})

const positionsTotalPages = computed(() => Math.ceil(positions.value.length / ITEMS_PER_PAGE))
const paginatedPositions = computed(() => {
  const start = (currentPage.positions.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const items = positions.value.slice(start, end);
  
  while (items.length < ITEMS_PER_PAGE) {
    items.push({ id: 0, name: '', category: '', price: 0 });
  }
  
  return items;
})

const categoriesTotalPages = computed(() => Math.ceil(categories.value.length / ITEMS_PER_PAGE))
const paginatedCategories = computed(() => {
  const start = (currentPage.categories.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const items = categories.value.slice(start, end);
  
  while (items.length < ITEMS_PER_PAGE) {
    items.push({ id: 0, name: '' });
  }
  
  return items;
})

// Обработчики сохранения
const handleSaveIngredients = (newIngredients: Array<{ name: string; unit: string }>) => {
  const lastId = ingredients.value.length > 0 ? Math.max(...ingredients.value.map(i => i.id)) : 0;
  const ingredientsWithIds = newIngredients.map((ingredient, index) => ({
    ...ingredient,
    id: lastId + index + 1
  }));
  ingredients.value.push(...ingredientsWithIds);
}

const handleSavePositions = (newPositions: Array<{ name: string; category: string; price: number }>) => {
  const lastId = positions.value.length > 0 ? Math.max(...positions.value.map(p => p.id)) : 0;
  const positionsWithIds = newPositions.map((position, index) => ({
    ...position,
    id: lastId + index + 1
  }));
  positions.value.push(...positionsWithIds);
}

const handleSaveCategories = (newCategories: Array<{ name: string }>) => {
  const lastId = categories.value.length > 0 ? Math.max(...categories.value.map(c => c.id)) : 0;
  const categoriesWithIds = newCategories.map((category, index) => ({
    ...category,
    id: lastId + index + 1
  }));
  categories.value.push(...categoriesWithIds);
}
</script>

<style scoped>
.edit-menu {
  padding: 2rem;
  min-width: 0;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.menu-sections {
  display: flex;
  gap: 2rem;
  align-items: stretch;
  min-width: 0;
}

.menu-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.menu-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  height: 30px;
  display: flex;
  align-items: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.section-description {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: left;
  align-self: flex-start;
  min-height: 2.5rem; /* Высота для двух строк текста */
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  display: grid;
  width: 100%;
  min-height: 40px;
}

/* Специфичные стили для каждой таблицы */
.menu-section:nth-child(1) .table-header,
.menu-section:nth-child(1) .table-row {
  grid-template-columns: minmax(200px, auto) minmax(120px, auto);
  gap: 2rem;
}

/* Выравнивание столбца Единица измерения */
.menu-section:nth-child(1) .table-header .header-cell:last-child,
.menu-section:nth-child(1) .table-row .cell:last-child {
  text-align: right;
  justify-self: end;
}

.menu-section:nth-child(2) .table-header,
.menu-section:nth-child(2) .table-row {
  grid-template-columns: minmax(200px, 1fr) minmax(150px, 1fr) minmax(120px, auto);
  gap: 2rem;
}

.menu-section:nth-child(3) .table-header,
.menu-section:nth-child(3) .table-row {
  grid-template-columns: minmax(200px, 1fr);
}

.header-cell {
  color: #6c757d;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: normal;
  line-height: 1.2;
}

.table-body {
  height: 480px; /* 8 строк * 60px (высота строки с отступами) */
}

.table-row {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
  display: grid;
  align-items: center;
  height: 60px; /* Фиксированная высота для каждой строки */
}

/* Пустые строки для поддержания высоты */
.empty-row {
  height: 60px;
  border-bottom: 1px solid #f8f9fa;
}

.cell {
  color: #1a1a1a;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Стили для колонки Название */
.menu-section:nth-child(1) .table-row .cell:first-child,
.menu-section:nth-child(2) .table-row .cell:first-child,
.menu-section:nth-child(3) .table-row .cell:first-child {
  font-weight: 600;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.table-footer {
  margin-top: 1rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-arrow {
  background: none;
  border: none;
  color: #4338ca;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-arrow:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.page-info {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 0.875rem;
  min-width: 2.5rem;
  text-align: center;
}

.add-button {
  padding: 0.5rem 1rem;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background: #3730a3;
}
</style> 