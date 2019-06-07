import { Line } from 'vue-chartjs';
export default {
  extends: Line,
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
    getChart() {
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'downloads',
            borderColor: '#249EBF',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: 'transparent',
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
