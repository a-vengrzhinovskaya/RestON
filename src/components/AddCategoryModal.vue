<template>
  <BaseModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" title="Добавление категорий">
    <div class="add-category-form">
      <div v-for="(item, index) in categories" :key="index" class="category-row">
        <div class="input-group">
          <label>НАЗВАНИЕ</label>
          <input 
            v-model="item.name"
            type="text"
            placeholder="Введите название"
          />
        </div>
        <button class="delete-button" @click="removeCategory(index)">
          <span class="material-icons">delete</span>
        </button>
      </div>

      <button class="add-field-button" @click="addCategory">
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
  (e: 'save', categories: Array<{ name: string }>): void;
}>();

interface Category {
  name: string;
}

const categories = ref<Category[]>([
  { name: '' }
]);

const addCategory = () => {
  categories.value.push({ name: '' });
};

const removeCategory = (index: number) => {
  categories.value.splice(index, 1);
};

const save = () => {
  emit('save', categories.value);
  emit('update:modelValue', false);
  categories.value = [{ name: '' }];
};
</script>

<style scoped>
.add-category-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-row {
  display: grid;
  grid-template-columns: 1fr auto;
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

input {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100%;
}

input:focus {
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