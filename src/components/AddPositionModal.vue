<template>
  <BaseModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" title="Добавление позиций">
    <div class="add-position-form">
      <div v-for="(item, index) in paginatedPositions" :key="index" class="position-row-with-ingredients">
        <div class="position-row">
          <div class="input-group">
            <label>НАЗВАНИЕ</label>
            <input 
              v-model="item.name"
              type="text"
              placeholder="Введите название"
            />
          </div>
          <div class="input-group">
            <label>КАТЕГОРИЯ</label>
            <select v-model="item.category">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="input-group">
            <label>СТОИМОСТЬ</label>
            <div class="price-input">
              <input 
                v-model="item.price"
                type="number"
                min="0"
                placeholder="0"
              />
              <span class="price-currency">₽</span>
            </div>
          </div>
          <button class="delete-button" @click="removePosition(index)">
            <span class="material-icons">delete</span>
          </button>
        </div>
        <button class="expand-ingredients" @click="toggleExpand(index)">
          <span class="material-icons">{{ expanded.includes((currentPage-1)*ITEMS_PER_PAGE+index) ? 'expand_less' : 'expand_more' }}</span>
          <span>Ингредиенты</span>
        </button>
        <transition name="fade">
          <div v-if="expanded.includes((currentPage-1)*ITEMS_PER_PAGE+index)" class="ingredients-block">
            <div v-for="(ing, ingIdx) in item.ingredients" :key="ingIdx" class="ingredient-row-modal">
              <select v-model="ing.name">
                <option v-for="ingr in ingredientsList" :key="ingr.name" :value="ingr.name">
                  {{ ingr.name }}
                </option>
              </select>
              <input type="number" min="0.01" step="0.01" v-model.number="ing.quantity" style="width: 80px;" />
              <span class="unit-label">
                {{ ingredientsList.find(i => i.name === ing.name)?.unit || '' }}
              </span>
              <button class="delete-button" @click="removeIngredientFromPosition(index, ingIdx)">
                <span class="material-icons">delete</span>
              </button>
            </div>
            <button class="add-field-button" @click="addIngredientToPosition(index)">+ Добавить ингредиент</button>
          </div>
        </transition>
      </div>

      <div class="modal-pagination">
        <button class="pagination-arrow" :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
        <span class="page-info">{{ currentPage }}/{{ totalPages }}</span>
        <button class="pagination-arrow" :disabled="currentPage === totalPages" @click="currentPage++">&gt;</button>
      </div>

      <button class="add-field-button" @click="addPosition">
        + Добавить поле
      </button>

      <div class="modal-footer">
        <button class="save-button" @click="save">Сохранить</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  modelValue: boolean,
  items: Array<{ name: string; category: string; price: number; ingredients?: Array<{ name: string; quantity: number }> }>,
  categories: string[],
  ingredientsList: Array<{ name: string; unit: string }>
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', positions: Array<{ name: string; category: string; price: number; ingredients?: Array<{ name: string; quantity: number }> }>): void;
}>();

interface IngredientRef {
  name: string;
  quantity: number;
}

interface Position {
  name: string;
  category: string;
  price: number;
  ingredients?: IngredientRef[];
}

const positions = ref<Position[]>([]);
const ITEMS_PER_PAGE = 3;
const currentPage = ref(1);
const expanded = ref<number[]>([]); // Индексы раскрытых позиций

watch(() => props.modelValue, (val) => {
  if (val) {
    positions.value = props.items.map(i => ({ 
      ...i, 
      ingredients: i.ingredients ? i.ingredients.map(ing => ({ ...ing })) : [] 
    }));
    if (positions.value.length === 0) {
      positions.value = [{ name: '', category: props.categories[0] || '', price: 0, ingredients: [] }];
    }
    currentPage.value = 1;
    expanded.value = [];
  }
});

const paginatedPositions = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return positions.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(positions.value.length / ITEMS_PER_PAGE));

const addPosition = () => {
  positions.value.push({ name: '', category: props.categories[0] || '', price: 0, ingredients: [] });
  if (paginatedPositions.value.length === 0 && currentPage.value < totalPages.value) {
    currentPage.value = totalPages.value;
  }
};

const removePosition = (index: number) => {
  const globalIndex = (currentPage.value - 1) * ITEMS_PER_PAGE + index;
  positions.value.splice(globalIndex, 1);
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
  if (positions.value.length === 0) {
    addPosition();
  }
};

const toggleExpand = (index: number) => {
  const globalIndex = (currentPage.value - 1) * ITEMS_PER_PAGE + index;
  if (expanded.value.includes(globalIndex)) {
    expanded.value = expanded.value.filter(i => i !== globalIndex);
  } else {
    expanded.value.push(globalIndex);
  }
};

const addIngredientToPosition = (posIndex: number) => {
  const globalIndex = (currentPage.value - 1) * ITEMS_PER_PAGE + posIndex;
  if (!positions.value[globalIndex].ingredients) positions.value[globalIndex].ingredients = [];
  positions.value[globalIndex].ingredients!.push({ name: props.ingredientsList[0]?.name || '', quantity: 1 });
};

const removeIngredientFromPosition = (posIndex: number, ingIndex: number) => {
  const globalIndex = (currentPage.value - 1) * ITEMS_PER_PAGE + posIndex;
  positions.value[globalIndex].ingredients!.splice(ingIndex, 1);
};

const save = () => {
  emit('save', positions.value);
  emit('update:modelValue', false);
};
</script>

<style scoped>
.add-position-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.position-row-with-ingredients {
  margin-bottom: 1.5rem;
}

.position-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  gap: 1rem;
  align-items: flex-end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100%;
}

input:focus, select:focus {
  outline: none;
  border-color: #4338ca;
}

.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.price-input input {
  padding-right: 2rem;
}

.price-currency {
  position: absolute;
  right: 0.75rem;
  color: #6c757d;
}

.delete-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.delete-button:hover {
  background-color: #f3f4f6;
}

.material-icons {
  font-size: 1.25rem;
}

.add-field-button {
  color: #4338ca;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
}

.add-field-button:hover {
  color: #3730a3;
}

.modal-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background: #4338ca;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.save-button:hover {
  background: #3730a3;
}

.modal-pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
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
.expand-ingredients {
  background: none;
  border: none;
  color: #4338ca;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin: 0.5rem 0 0.25rem 0;
}
.ingredients-block {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: -0.5rem;
}
.ingredient-row-modal {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.unit-label {
  color: #6c757d;
  font-size: 0.875rem;
  min-width: 32px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 