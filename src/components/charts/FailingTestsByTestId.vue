<template>
  <div class='content'>
    <div class='container'>
      <div class='title-container'>
        <h1 v-if='loaded'>Failing tests</h1>
        <span class='subtitle'>Failing tests per test ID</span>
      </div>
      <div class='Chart__container' v-if='loaded'>
        <div class='Chart__title'></div>
        <div class='Chart__content'>
          <bar-chart v-if='loaded' :chart-data='chart.data' :chart-labels='chart.labels'></bar-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import BarChart from "@/components/chartTypes/BarChart";
import { dateToYear, dateToDay, dateBeautify } from "@/utils/dateFormatter";
import { removeDuplicate, groupData } from "@/utils/downloadFormatter";
import dummydata from "@/data/dummydata.json";
export default {
  components: {
    BarChart
  },
  props: {
    startDate: {
      type: Date,
      required: false
    },
    endDate: {
      type: Date,
      required: false
    },
    selectedFacets: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      dummydata: dummydata,
      loaded: false,
      chart: null
      // formattedPeriod: null
    };
  },
  computed: {
    _endDate() {
      return this.endDate ? moment(this.endDate).format("YYYY-MM-DD") : null;
    },
    _startDate() {
      return this.startDate
        ? moment(this.startDate).format("YYYY-MM-DD")
        : null;
    },
    period() {
      return this.periodStart
        ? `${this._startDate}:${this._endDate}`
        : "last-month";
    },
    formattedPeriod() {
      if (this.startDate || this.endDate) {
        const startDate = this.startDate
          ? dateBeautify(this.startDate)
          : "first data";
        const endDate = this.endDate ? dateBeautify(this.endDate) : "last data";
        return `${startDate} - ${endDate}`;
      } else {
        ("lifetime");
      }
    }
  },
  mounted() {
    //  this.resetState();
    this.showProcessingSessionsByStartDate();
    this.generateFormatedPeriod();
  },
  watch: {
    selectedFacets: {
      handler: function() {
        this.showProcessingSessionsByStartDate();
      },
      deep: true
    },
    startDate() {
      //  this.resetState();
      this.showProcessingSessionsByStartDate();
      this.generateFormatedPeriod();
    },
    endDate() {
      //   this.resetState();
      this.showProcessingSessionsByStartDate();
      this.generateFormatedPeriod();
    }
  },
  methods: {
    resetState() {
      this.loaded = false;
      this.showError = false;
    },
    generateFormatedPeriod() {
      /*this.formattedPeriod = this.periodStart
        ? `${dateBeautify(this._startDate)} - ${dateBeautify(this._endDate)}`
        : "last-month";*/
    },
    enumerateDaysBetweenDates(startDate, endDate) {
      var dates = [];
      var currDate = moment(startDate).startOf("day");
      var lastDate = moment(endDate).startOf("day");
      while (currDate.add(1, "days").diff(lastDate) < 0) {
        let date = currDate.clone().toDate();
        dates.push(moment(date).format("YYYY-MM-DD"));
      }
      return dates;
    },
    isInPeriod(date) {
      const isSameOrAfterStartDate = this.startDate
        ? moment(date).isSameOrAfter(this.startDate)
        : true;
      const isSameOrBeforeEndDate = this.endDate
        ? moment(date).isSameOrBefore(this.endDate)
        : true;
      return isSameOrAfterStartDate && isSameOrBeforeEndDate;
    },
    getFailingTestsByTestId() {
      let failingTests = {};
      let firstDate = null;
      let lastDate = null;
      // Get processing sessions from data
      const organizations = this.dummydata.organizations.filter(
        organization => {
          let isSelectedOrganization = true;
          if (
            this.selectedFacets &&
            this.selectedFacets.organization &&
            this.selectedFacets.organization.length
          ) {
            isSelectedOrganization = this.selectedFacets.organization.filter(
              organizationFacetId => {
                return organization.id === organizationFacetId;
              }
            ).length;
          }
          return isSelectedOrganization;
        }
      );

      organizations.forEach(organization => {
        return organization.arkadeClients.forEach(arkadeClient => {
          arkadeClient.processingSessions.forEach(processingSession => {
            if (this.isInPeriod(processingSession.time)) {
              if (
                processingSession.testRun &&
                processingSession.testRun.failingTests
              ) {
                processingSession.testRun.failingTests.forEach(failingTest => {
                  failingTests[failingTest.testId]
                    ? failingTests[failingTest.testId]++
                    : (failingTests[failingTest.testId] = 1);
                });
              }
            }
          });
        });
      });
      let labels = [];
      let data = [];
      Object.keys(failingTests).sort().forEach(failingTestLabel => {
        labels.push(failingTestLabel);
        data.push(failingTests[failingTestLabel])
      })
      return { labels, data };
    },

    showProcessingSessionsByStartDate() {
      this.chart = this.getFailingTestsByTestId();
      this.loaded = true;
    },
    formatYear() {
      this.labelsYear = this.rawData
        .map(entry => dateToYear(entry.day))
        .reduce(removeDuplicate, []);
      this.downloadsYear = groupData(this.rawData, dateToYear);
    }
  }
};
</script>
