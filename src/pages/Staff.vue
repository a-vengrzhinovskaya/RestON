<template>
  <div class="staff-page">
    <div class="staff-header">Сотрудники</div>
    <div class="staff-cards">
      <div class="staff-card">
        <div class="card-title">Должности</div>
        <div class="card-desc">Создайте должности, добавьте оклад и укажите какой % от продаж в выбранных категориях будет начисляться сотрудникам</div>
        <div class="staff-table">
          <div class="table-header">
            <div>НАЗВАНИЕ</div>
            <div>КАТЕГОРИИ</div>
            <div>% ОТ ПРОДАЖ</div>
            <div>ОКЛАД</div>
          </div>
          <div class="table-row" v-for="role in roles" :key="role.name">
            <div>{{ role.name }}</div>
            <div>{{ role.categories || '-' }}</div>
            <div>{{ role.percent || '-' }}</div>
            <div>{{ role.salary ? role.salary + ' ₽' : '-' }}</div>
          </div>
        </div>
        <div class="add-link" @click="addRole">+ Добавить поле</div>
      </div>
      <div class="staff-card">
        <div class="card-title">Сотрудники</div>
        <div class="card-desc">Добавьте всех ваших сотрудников</div>
        <div class="staff-table">
          <div class="table-header">
            <div>ПОЛНОЕ ФИО</div>
            <div>ДАТА РОЖДЕНИЯ</div>
            <div>ГРАФИК</div>
          </div>
          <div class="table-row" v-for="employee in employees" :key="employee.name">
            <div>{{ employee.name }}</div>
            <div>{{ employee.birth }}</div>
            <div>{{ employee.schedule }}</div>
          </div>
        </div>
        <div class="add-link" @click="addEmployee">+ Добавить поле</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const roles = ref([
  { name: 'Повар', categories: 'Кухня', percent: 10, salary: '17 400' },
  { name: 'Официант', categories: '-', percent: '', salary: '10 250' },
  { name: 'Бармен', categories: 'Напитки', percent: 15, salary: '30 400' },
  { name: 'Уборщик', categories: '-', percent: '', salary: '5 577' },
])
const employees = ref([
  { name: 'Иванов Иван Иванович', birth: '05.05.1998', schedule: '5/2' },
  { name: 'Осипов Илья Миронович', birth: '05.05.1998', schedule: '2/2' },
  { name: 'Комаров Кирилл Ильич', birth: '05.05.1998', schedule: '2/2' },
  { name: 'Евсеев Даниил Иванович', birth: '05.05.1998', schedule: '2/2' },
  { name: 'Тун Анастасия Ивановна', birth: '05.05.1998', schedule: '5/2' },
])
function addRole() {
  roles.value.push({ name: '', categories: '', percent: '', salary: '' })
}
function addEmployee() {
  employees.value.push({ name: '', birth: '', schedule: '' })
}
</script>

<style scoped>
.staff-page {
  padding: 2.5rem 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}
.staff-header {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1a1a1a;
}
.staff-cards {
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
}
.staff-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #0001;
  padding: 2rem 2rem 1.5rem 2rem;
  flex: 1 1 0;
  min-width: 350px;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}
.card-desc {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}
.staff-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #fcfcff;
  border: 1px solid #f1f1fa;
  margin-bottom: 1rem;
}
.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr 1.2fr;
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 600;
  background: #f6f6fb;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f1fa;
}
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr 1.2fr;
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f6f6fb;
  align-items: center;
}
.staff-card:last-child .table-header,
.staff-card:last-child .table-row {
  grid-template-columns: 2fr 1.2fr 0.8fr;
}
.add-link {
  color: #4338ca;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-left: 1rem;
  transition: color 0.2s;
}
.add-link:hover {
  color: #3730a3;
  text-decoration: underline;
}
</style>