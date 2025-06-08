import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import Dashboard from '@/pages/Dashboard.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import SubscriptionPage from '@/pages/SubscriptionPage.vue'
import ClosedChecks from '@/components/ClosedChecks.vue'
import GeneralStatistics from '@/components/GeneralStatistics.vue'
import CashShifts from '@/components/CashShifts.vue'
import Sales from '@/components/Sales.vue'
import Storage from '@/pages/Storage.vue'
import EditMenu from '@/pages/EditMenu.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: GeneralStatistics
        },
        {
          path: 'closed-checks',
          name: 'closed-checks',
          component: ClosedChecks
        },
        {
          path: 'cash-shifts',
          name: 'cash-shifts',
          component: CashShifts
        },
        {
          path: 'sales',
          name: 'sales',
          component: Sales
        },
        {
          path: 'menu/storage',
          name: 'storage',
          component: Storage
        },
        {
          path: 'menu/edit',
          name: 'edit-menu',
          component: EditMenu
        }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    },
    {
      path: '/subscription',
      name: 'subscription',
      component: SubscriptionPage
    }
  ]
})

export default router