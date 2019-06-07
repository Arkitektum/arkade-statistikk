import moment from 'moment';
import LineChart from '@/components/chartTypes/LineChart';
import { dateToYear, dateBeautify } from '@/utils/dateFormatter';
import { removeDuplicate, groupData } from '@/utils/downloadFormatter';
import dummydata from '@/data/dummydata.json';
export default {
  components: {
    LineChart
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
    };
  },
  computed: {
    _endDate() {
      return this.endDate ? moment(this.endDate).format('YYYY-MM-DD') : null;
    },
    _startDate() {
      return this.startDate
        ? moment(this.startDate).format('YYYY-MM-DD')
        : null;
    },
    period() {
      return this.periodStart
        ? `${this._startDate}:${this._endDate}`
        : 'last-month';
    },
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
    },
    startDate() {
      //  this.resetState();
      this.showProcessingSessionsByStartDate();
    },
    endDate() {
      //   this.resetState();
      this.showProcessingSessionsByStartDate();
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
            let date = moment(processingSession.time).format('YYYY-MM-DD');
            firstDate =
              !firstDate || moment(date).isBefore(firstDate) ? date : firstDate;
            lastDate =
              !lastDate || moment(date).isAfter(lastDate) ? date : lastDate;
            processingSessions[date]
              ? processingSessions[date]++
              : (processingSessions[date] = 1);
          });
        });
      });

      firstDate = this.startDate
        ? moment(this.startDate).format('YYYY-MM-DD')
        : firstDate;
      lastDate = this.endDate
        ? moment(this.endDate).format('YYYY-MM-DD')
        : lastDate;
      let labels = this.enumerateDaysBetweenDates(firstDate, lastDate);
      let data = this.enumerateDaysBetweenDates(firstDate, lastDate).map(
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
