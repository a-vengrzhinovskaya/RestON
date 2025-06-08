export interface Ingredient {
  id: number;
  name: string;
  unit: 'кг' | 'шт' | 'л';
}

export const ingredients: Ingredient[] = [
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
]; 