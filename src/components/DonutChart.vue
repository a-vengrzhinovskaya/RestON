<template>
  <div class="donut-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Кола 0.5л', 'Донер', 'Гавайская стандарт'],
      datasets: [{
        data: [35, 45, 20],
        backgroundColor: [
          '#4338ca',
          '#ec4899',
          '#14b8a6'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: '70%'
    }
  })
})
</script>

<style scoped>
.donut-chart {
  width: 100%;
  height: 200px;
}
</style> 