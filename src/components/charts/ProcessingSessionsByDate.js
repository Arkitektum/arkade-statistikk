import moment from 'moment';
import LineChart from '@/components/chartTypes/LineChart';
import { dateToYear, dateBeautify } from '@/utils/dateFormatter';
import { removeDuplicate, groupData } from '@/utils/downloadFormatter';
import { filterOrganizations, filterArkadeClients, filterProcessingSessions } from '@/utils/facetFilters';
import dummydata from '@/data/dummydata.json';
export default {
  components: {
    LineChart
  },
  props: {
    firstDate: {
      type: Date,
      required: false
    },
    lastDate: {
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
    /*
    period() {
      return this.periodStart
        ? `${this._startDate}:${this._endDate}`
        : 'last-month';
    }, */
    formattedPeriod() {
      return this.periodStart
        ? `${dateBeautify(this._startDate)} - ${dateBeautify(this._endDate)}`
        : 'last-mont';
    }
  },
  mounted() {
    //  this.resetState();
    this.showProcessingSessionsByStartDate();
  },
  watch: {
    selectedFacets: {
      handler: function() {
        this.showProcessingSessionsByStartDate();
      },
      deep: true
    }
  },
  methods: {
    resetState() {
      this.loaded = false;
      this.showError = false;
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

    getProcessingSessionsByDate() {
      let processingSessions = {};
      let startDate = this.selectedFacets && this.selectedFacets.period && this.selectedFacets.period.startDate ? this.selectedFacets.period.startDate : this.firstDate;
      let endDate = this.selectedFacets && this.selectedFacets.period && this.selectedFacets.period.endDate ? this.selectedFacets.period.endDate : this.lastDate;
      // Get processing sessions from data
      filterOrganizations(this.selectedFacets, this.dummydata.organizations).forEach(organization => {
        filterArkadeClients(this.selectedFacets, organization.arkadeClients).forEach(arkadeClient => {
          filterProcessingSessions(this.selectedFacets, arkadeClient.processingSessions).forEach(processingSession => {
            let date = moment(processingSession.time).format('YYYY-MM-DD');
            processingSessions[date]
              ? processingSessions[date]++
              : (processingSessions[date] = 1);
          });
        });
      });
      let labels = this.enumerateDaysBetweenDates(startDate, endDate);
      let data = this.enumerateDaysBetweenDates(startDate, endDate).map(
        date => {
          return processingSessions[date] ? processingSessions[date] : 0;
        }
      );
      return { labels, data };
    },
    showProcessingSessionsByStartDate() {
      this.chart = this.getProcessingSessionsByDate();
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
