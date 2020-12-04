<template>
  <div>
    <Navbar />
  <body style="margin-top: 30px">
    <section class="columns">
      <div class="column">
        <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
        <b-button v-if="(serialModule.currentMode != 0) && !serialModule.collectingData" type="is-danger" expanded @click="serialModule.startDataCapture()">Start Data Collection</b-button>
        <b-button v-if="(serialModule.currentMode != 0) && serialModule.collectingData" type="is-success" expanded @click="serialModule.stopDataCapture()">Collecting Data...</b-button>
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
import SerialState from '@/store/serial'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      serialModule: {},
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
          enabled: false
        },
        animation: {
          duration: 0
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
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 5
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.serialModule = getModule(SerialState, this.$store);
  },
  computed: {
    chartData: function() {
      return {
        labels: this.serialModule.timeSignalReadings,
        datasets: [
          {
            label: 'Atrial',
            data: this.serialModule.atrSignalReadings,
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Ventricular',
            data: this.serialModule.ventSignalReadings,
            fill: false,
            borderColor: 'rgba(32, 156, 238, 1)',
            borderWidth: 1
          }
        ]
      };
    },
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
