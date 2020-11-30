<template>
  <div>
    <Navbar />
  <body style="margin-top: 30px">
    <section class="columns">
      <div class="column" :style="'height: ' + chartHeight">
        <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
      </div>
      <div class="column">
        <b-tabs type="is-boxed" size="is-medium">
          <b-tab-item label="AOO"><AOO></AOO></b-tab-item>
          <b-tab-item label="VOO"><VOO></VOO></b-tab-item>
          <b-tab-item label="AAI"><AAI></AAI></b-tab-item>
          <b-tab-item label="VVI"><VVI></VVI></b-tab-item>
          <b-tab-item label="DOO"><DOO></DOO></b-tab-item>
        </b-tabs>
      </div>
    </section>
  </body>
  </div>
</template>

<script>
import LineChart from '@/dashboard/LineChart'
import AAI from '@/dashboard/dashboardViews/AAI'
import AOO from '@/dashboard/dashboardViews/AOO'
import DOO from '@/dashboard/dashboardViews/DOO'
import VOO from '@/dashboard/dashboardViews/VOO'
import VVI from '@/dashboard/dashboardViews/VVI'
import Navbar from '@/dashboard/Navbar'
export default {
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'ECG',
          fontSize: 30
        },
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Seconds'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
            }
          }]
        }
      }
    }
  },
  methods: {
    selectMode(mode) {
      console.log(mode);
      this.selectedMode = mode;
    }
  },
  computed: {
    chartData: function() {
      return {
        labels: [],
        datasets: [
          {
            label: 'Atrial',
            data: [],
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Ventricular',
            data: [],
            fill: false,
            borderColor: 'rgba(32, 156, 238, 1)',
            borderWidth: 1
          }
        ]
      };
    },
    chartHeight: function() {
      return window.innerHeight.toString();
    }
  },
  components: {
    Navbar,
    AAI,
    AOO,
    DOO,
    VOO,
    VVI,
    LineChart
  }
}
</script>
