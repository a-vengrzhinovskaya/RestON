import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    user: null
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const res = await axios.post('/api/auth/login', { email, password })
        this.token = res.data.token
        this.user = res.data.user
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return true
      } catch {
        return false
      }
    },
    logout() {
      this.token = ''
      this.user = null
      delete axios.defaults.headers.common['Authorization']
    }
  }
})