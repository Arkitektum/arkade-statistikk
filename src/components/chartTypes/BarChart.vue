<script>
import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
  props: {
    chartData: {
      type: Array | Object,
      required: false
    },
    chartLabels: {
      type: Array,
      required: true
    },
    dataLabel: {
        type: String,
        required: false
    }
  },
  mounted() {
    this.renderChart(this.getChart(), this.getOptions());
  },
  watch: {
    chartData() {
      this.renderChart(this.getChart(), this.getOptions());
    },
    chartLabels() {
      this.renderChart(this.getChart(), this.getOptions());
    }
  },
  methods: {
    generateColors() {
      let backgroundColors = [];
      let borderColors = [];
      for (let i = 0; i < this.chartData.length; i++) {
        const hueValue = (i * 111) % 360;
        backgroundColors.push(`hsla(${hueValue}, 80%, 60%, 0.3)`);
        borderColors.push(`hsla(${hueValue}, 80%, 60%, 1)`);
      }
      return { backgroundColors, borderColors };
    },
    getChart() {
      const colors = this.generateColors();
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.dataLabel ? this.dataLabel : '',
            backgroundColor: colors.backgroundColors,
            borderColor: colors.borderColors,
            borderWidth: 1,
            data: this.chartData
          }
        ]
      };
    },
    getOptions() {
      return {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      };
    }
  }
};
</script>
