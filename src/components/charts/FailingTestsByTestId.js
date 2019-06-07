import moment from 'moment';
import BarChart from '@/components/chartTypes/BarChart';
import { dateToYear, dateBeautify } from '@/utils/dateFormatter';
import { removeDuplicate, groupData } from '@/utils/downloadFormatter';
import { filterOrganizations, filterArkadeClients, filterProcessingSessions } from '@/utils/facetFilters';
import dummydata from '@/data/dummydata.json';
export default {
  components: {
    BarChart
  },
  props: {
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
      return this.selectedFacets && this.selectedFacets.period && this.selectedFacets.period.endDate
        ? moment(this.selectedFacets && this.selectedFacets.period && this.selectedFacets.period.endDate).format('YYYY-MM-DD') : null;
    },
    _startDate() {
      return this.selectedFacets && this.selectedFacets.period && this.selectedFacets.period.startDate
        ? moment(this.selectedFacets && this.selectedFacets.period && this.selectedFacets.period.startDate).format('YYYY-MM-DD')
        : null;
    },
    /* period() {
      return this.periodStart
        ? `${this._startDate}:${this._endDate}`
        : 'last-month';
    }, */
    formattedPeriod() {
      if (this.startDate || this.endDate) {
        const startDate = this.startDate
          ? dateBeautify(this.startDate)
          : 'first data';
        const endDate = this.endDate ? dateBeautify(this.endDate) : 'last data';
        return `${startDate} - ${endDate}`;
      } else {
        return 'lifetime';
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
      /* this.formattedPeriod = this.periodStart
        ? `${dateBeautify(this._startDate)} - ${dateBeautify(this._endDate)}`
        : "last-month"; */
    },
    enumerateDaysBetweenDates(startDate, endDate) {
      var dates = [];
      var currDate = moment(startDate).startOf('day');
      var lastDate = moment(endDate).startOf('day');
      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        let date = currDate.clone().toDate();
        dates.push(moment(date).format('YYYY-MM-DD'));
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
      // Get processing sessions from data
      filterOrganizations(this.selectedFacets, this.dummydata.organizations).forEach(organization => {
        filterArkadeClients(this.selectedFacets, organization.arkadeClients).forEach(arkadeClient => {
          filterProcessingSessions(this.selectedFacets, arkadeClient.processingSessions).forEach(processingSession => {
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
        data.push(failingTests[failingTestLabel]);
      });
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
