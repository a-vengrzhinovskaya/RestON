<template>
  <div class="time-range-input">
    <div class="time-input">
      <div class="input-with-icon">
        <input 
          type="time" 
          v-model="localStartTime"
          :disabled="disabled"
          @change="emitChange"
        />
        <span class="material-icons time-icon" :class="{ 'clickable': !disabled }">
          schedule
        </span>
      </div>
      <span>-</span>
      <div class="input-with-icon">
        <input 
          type="time" 
          v-model="localEndTime"
          :disabled="disabled"
          @change="emitChange"
        />
        <span class="material-icons time-icon" :class="{ 'clickable': !disabled }">
          schedule
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import 'material-icons/iconfont/material-icons.css'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Parse initial time range
const [initialStart = '13:00', initialEnd = '02:00'] = props.modelValue.split('-')

const localStartTime = ref(initialStart)
const localEndTime = ref(initialEnd)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  const [start = '13:00', end = '02:00'] = newValue.split('-')
  localStartTime.value = start
  localEndTime.value = end
})

const emitChange = () => {
  emit('update:modelValue', `${localStartTime.value}-${localEndTime.value}`)
}
</script>

<style scoped>
.time-range-input {
  width: 100%;
}

.time-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.input-with-icon {
  position: relative;
  flex: 1;
  min-width: 130px; /* Minimum width to prevent squeezing */
  max-width: 145px; /* Maximum width to maintain consistency */
}

.time-input input {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.75rem;
  padding-right: 2rem;
  font-size: 1rem;
  width: 100%;
  background-color: white;
  color: #1a1a1a;
  height: 42px; /* Fixed height to match other inputs */
  box-sizing: border-box;
}

.time-input input:disabled {
  cursor: not-allowed;
  background-color: white;
  color: #1a1a1a;
}

.time-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 18px;
  pointer-events: none;
}

.time-icon.clickable {
  pointer-events: auto;
  cursor: pointer;
}

.time-input span {
  color: #6c757d;
  flex-shrink: 0;
  padding: 0 0.5rem;
}
</style> 