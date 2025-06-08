<template>
  <BaseModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" title="Добавление позиций">
    <div class="add-position-form">
      <div v-for="(item, index) in positions" :key="index" class="position-row">
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
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  modelValue: boolean;
  categories: string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', positions: Array<{ name: string; category: string; price: number }>): void;
}>();

interface Position {
  name: string;
  category: string;
  price: number;
}

const positions = ref<Position[]>([
  { name: '', category: props.categories[0] || '', price: 0 }
]);

const addPosition = () => {
  positions.value.push({ name: '', category: props.categories[0] || '', price: 0 });
};

const removePosition = (index: number) => {
  positions.value.splice(index, 1);
};

const save = () => {
  emit('save', positions.value);
  emit('update:modelValue', false);
  positions.value = [{ name: '', category: props.categories[0] || '', price: 0 }];
};
</script>

<style scoped>
.add-position-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
</style> 