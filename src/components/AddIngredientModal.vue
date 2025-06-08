<template>
  <BaseModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" title="Добавление ингредиентов">
    <div class="add-ingredient-form">
      <div v-for="(item, index) in ingredients" :key="index" class="ingredient-row">
        <div class="input-group">
          <label>НАЗВАНИЕ</label>
          <input 
            v-model="item.name"
            type="text"
            placeholder="Введите название"
          />
        </div>
        <div class="input-group">
          <label>ЕДИНИЦА ИЗМЕРЕНИЯ</label>
          <select v-model="item.unit">
            <option value="кг">кг</option>
            <option value="л">л</option>
            <option value="шт">шт</option>
          </select>
        </div>
        <button class="delete-button" @click="removeIngredient(index)">
          <span class="material-icons">delete</span>
        </button>
      </div>

      <button class="add-field-button" @click="addIngredient">
        + Добавить поле
      </button>

      <div class="modal-footer">
        <button class="save-button" @click="save">Сохранить</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', ingredients: Array<{ name: string; unit: string }>): void;
}>();

interface Ingredient {
  name: string;
  unit: string;
}

const ingredients = ref<Ingredient[]>([
  { name: '', unit: 'кг' }
]);

const addIngredient = () => {
  ingredients.value.push({ name: '', unit: 'кг' });
};

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
};

const save = () => {
  emit('save', ingredients.value);
  emit('update:modelValue', false);
  ingredients.value = [{ name: '', unit: 'кг' }];
};
</script>

<style scoped>
.add-ingredient-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ingredient-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
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
</style> 