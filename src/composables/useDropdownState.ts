import { ref } from 'vue'

const activeDropdown = ref<string | null>(null)

export function useDropdownState() {
  const openDropdown = (name: string) => {
    if (activeDropdown.value === name) {
      activeDropdown.value = null
    } else {
      activeDropdown.value = name
    }
  }

  const closeAllDropdowns = () => {
    activeDropdown.value = null
  }

  const isDropdownOpen = (name: string) => {
    return activeDropdown.value === name
  }

  return {
    openDropdown,
    closeAllDropdowns,
    isDropdownOpen
  }
} 