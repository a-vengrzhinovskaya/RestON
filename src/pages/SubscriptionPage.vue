<template>
  <div class="subscription-page">
    <!-- Header -->
    <header class="topbar">
      <div class="logo">
        <h1 class="clickable" @click="$router.push('/dashboard')">RestON <span>Администратор</span></h1>
      </div>
      <div class="header-center">
        <button class="btn-outline active">Подписка</button>
        <button class="btn-outline" @click="$router.push('/settings')">Настройки</button>
      </div>
      <button class="user-email">
        demo@gmail.com
        <span class="arrow-down">↓</span>
      </button>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <div class="subscription-cards">
        <!-- Yearly subscription -->
        <div class="subscription-card">
          <div class="card-header">
            <h2>Годовая оплата</h2>
            <div class="tags">
              <span class="tag discount">-39% скидка</span>
              <span class="tag included">
                <span class="dot"></span>
                Все включено
              </span>
            </div>
          </div>

          <div class="price-block">
            <div class="price">
              <div class="amount">1 400 ₽</div>
              <div class="period">за месяц</div>
            </div>
            <div class="savings">
              При оформлении годовой подписки вы экономите 10 800 ₽ в год
            </div>
            <div class="payment-row">
              <button class="pay-button">Оплатить</button>
              <div class="total-price">
                <div class="old-price">27 600 ₽ в год</div>
                <div class="new-price">16 800 ₽ в год</div>
              </div>
            </div>
          </div>

          <img src="@/assets/yearly_subscripton.png" alt="Годовая подписка" class="subscription-image" />
        </div>

        <!-- Monthly subscription -->
        <div class="subscription-card">
          <div class="card-header">
            <h2>Ежемесячная оплата</h2>
            <div class="tags">
              <span class="tag included">
                <span class="dot"></span>
                Все включено
              </span>
            </div>
          </div>

          <div class="price-block">
            <div class="price">
              <div class="amount">2 300 ₽</div>
              <div class="period">за месяц</div>
            </div>
            <div class="savings">
              Идеально, чтобы начать
            </div>
            <div class="payment-row">
              <button class="pay-button">Оплатить</button>
              <div class="total-price">
                <div class="new-price">27 600 ₽ в год</div>
              </div>
            </div>
          </div>

          <img src="@/assets/monthly_subscription.png" alt="Ежемесячная подписка" class="subscription-image" />
        </div>
      </div>

      <div class="subscription-footer">
        <span class="expiry-date">
          Подписка истекает <strong>12 июля 2024г</strong>
        </span>
        <button class="link-card-button">Привязать карту</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added if needed
</script>

<style scoped>
.subscription-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #f3f4f9;
  border-bottom: 1px solid #e9ecef;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
}

.logo h1:hover {
  opacity: 0.8;
}

.logo span {
  font-weight: normal;
  color: #6c757d;
}

.header-center {
  display: flex;
  gap: 1rem;
  justify-self: center;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #4338ca;
  border-radius: 6px;
  background: white;
  color: #4338ca;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-outline.active {
  background: #4338ca;
  color: white;
}

.user-email {
  justify-self: end;
  color: #6366f1;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-email:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.arrow-down {
  color: #6c757d;
  font-size: 0.75rem;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.subscription-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.subscription-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

.tags {
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
  margin-left: auto;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.tag.discount {
  color: #ef4444;
}

.tag.included {
  color: #10b981;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: currentColor;
  border-radius: 50%;
}

.price-block {
  position: relative;
  z-index: 1;
}

.price {
  margin-bottom: 1rem;
}

.amount {
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.period {
  color: #1a1a1a;
  font-size: 0.875rem;
}

.savings {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  max-width: 300px;
}

.payment-row {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  height: 42px; /* Высота стандартной кнопки */
}

.total-price {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.old-price {
  color: #6c757d;
  text-decoration: line-through;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1;
}

.new-price {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 0.875rem;
  line-height: 1;
}

.pay-button {
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-button:hover {
  background: #3730a3;
}

.subscription-image {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  pointer-events: none;
}

.subscription-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.expiry-date {
  color: #6c757d;
}

.expiry-date strong {
  color: #1a1a1a;
}

.link-card-button {
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.link-card-button:hover {
  background: #3730a3;
}
</style> 