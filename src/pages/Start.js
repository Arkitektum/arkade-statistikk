import axios from 'axios';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';
import ProcessingSessionsByDate from '@/components/charts/ProcessingSessionsByDate.vue';
import FailingTestsByTestId from '@/components/charts/FailingTestsByTestId.vue';
import { dateToYear, dateBeautify } from '@/utils/dateFormatter';
import { removeDuplicate, groupData } from '@/utils/downloadFormatter';
import dummydata from '@/data/dummydata.json';
export default {
  components: {
    Datepicker,
    ProcessingSessionsByDate,
    FailingTestsByTestId
  },
  data() {
    return {
      dummydata: dummydata,
      startDate: null,
      endDate: null,
      noDate: false,
      facets: null,
      selectedCharts: {
        processingSessionsByDate: true,
        failingTestsByTestId: true
      },
      selectedFacets: {
        organization: [],
        arkadeClient: [],
        operatingSystem: [],
        userInterface: [],
        version: [],
        processingSession: [],
        archiveSource: [],
        archiveType: [],
        period: {
          startDate: null,
          endDate: null
        }
      },
      expandedFacets: {
        organization: true,
        arkadeClient: true,
        operatingSystem: true,
        userInterface: true,
        version: true,
        processingSession: true,
        archiveSource: true,
        archiveType: true,
        period: true
      }
    };
  },
  watch: {
    noDate() {
      if (this.noDate) {
        this.startDate = null;
        this.endDate = null;
      }
    },
    startDate() {
      if (this.startDate) {
        this.noDate = false;
      } else if (this.endDate) {
        this.noDate = true;
      }
    },
    endDate() {
      if (this.endDate) {
        this.noDate = false;
      } else if (this.startDate) {
        this.noDate = true;
      }
    }
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
      return this.startDate
        ? `${this._startDate}:${this._endDate}`
        : 'last-month';
    },
    formattedPeriod() {
      return this.startDate
        ? `${dateBeautify(this._startDate)} - ${dateBeautify(this._endDate)}`
        : 'last-month';
    }
  },
  mounted() {
    this.getFacets();
    if (this.$route.params.package) {
    }
  },
  methods: {
    resetState() {
      this.loaded = false;
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
    showProcessingSessionsByStartDate() {
      this.chart = this.getProcessingSessionsByDate();
      this.loaded = true;
    },
    pushIfNotExists(array, value) {
      if (array.findIndex(arrayElement => typeof (value) === 'object' ? arrayElement.id === value.id : arrayElement === value) === -1) {
        array.push(value);
      }
      return array;
    },
    removeSelectedFacet(facetType, facetId) {
      if (this.selectedFacets[facetType]) {
        const selectedFacetIndex = this.selectedFacets[facetType].indexOf(
          facetId
        );
        if (selectedFacetIndex !== -1) {
          this.selectedFacets[facetType].splice(selectedFacetIndex, 1);
        }
      }
    },
    addSelectedFacet(facetType, facetId) {
      if (!this.selectedFacets[facetType]) {
        this.selectedFacets[facetType] = [];
      }
      this.selectedFacets[facetType].push(facetId);
    },
    toggleSelectedFacet(facetType, facetId) {
      this.facetIsSelected(facetType, facetId)
        ? this.removeSelectedFacet(facetType, facetId)
        : this.addSelectedFacet(facetType, facetId);
    },
    facetIsSelected(facetType, facetId) {
      if (!this.selectedFacets[facetType]) {
        return false;
      } else {
        return this.selectedFacets[facetType].filter(selectedFacetId => {
          return facetId === selectedFacetId;
        }).length;
      }
    },
    getFacets() {
      this.facets = {
        organization: [],
        arkadeClient: {
          operatingSystem: [],
          userInterface: [],
          version: []
        },
        processingSession: {
          archiveSource: [],
          archiveType: [],
          period: {
            firstDate: null,
            lastDate: null
          }
        }
      };
      this.dummydata.organizations.forEach(organization => {
        this.facets.organization.push({
          id: organization.id,
          name: `${organization.name} (${organization.type})`
        });
        organization.arkadeClients.forEach(arkadeClient => {
          this.facets.arkadeClient.operatingSystem = this.pushIfNotExists(
            this.facets.arkadeClient.operatingSystem,
            {
              id: arkadeClient.operatingSystem,
              name: arkadeClient.operatingSystem
            }
          );
          this.facets.arkadeClient.userInterface = this.pushIfNotExists(
            this.facets.arkadeClient.userInterface,
            {
              id: arkadeClient.userInterface,
              name: arkadeClient.userInterface
            }
          );
          this.facets.arkadeClient.version = this.pushIfNotExists(
            this.facets.arkadeClient.version,
            {
              id: arkadeClient.version,
              name: arkadeClient.version
            }
          );

          arkadeClient.processingSessions.forEach(processingSession => {
            this.facets.processingSession.archiveSource = this.pushIfNotExists(
              this.facets.processingSession.archiveSource,
              {
                id: processingSession.archiveSource,
                name: processingSession.archiveSource
              }
            );
            this.facets.processingSession.archiveType = this.pushIfNotExists(
              this.facets.processingSession.archiveType,
              {
                id: processingSession.archiveType,
                name: processingSession.archiveType
              }
            );
            this.facets.processingSession.period.firstDate = !this.facets.processingSession.period.firstDate || moment(processingSession.time).isBefore(this.facets.processingSession.period.firstDate)
              ? processingSession.time
              : this.facets.processingSession.period.firstDate;
            this.facets.processingSession.period.lastDate = !this.facets.processingSession.period.lastDate || moment(processingSession.time).isAfter(this.facets.processingSession.period.lastDate)
              ? processingSession.time
              : this.facets.processingSession.period.lastDate;
          });
        });
      });
    },
    requestData() {
      if (
        this.package === null ||
        this.package === '' ||
        this.package === 'undefined'
      ) {
        this.showError = true;
        return;
      }
      this.resetState();
      axios
        .get(
          `https://api.npmjs.org/downloads/range/${this.period}/${this.package}`
        )
        .then(response => {
          this.rawData = response.data.downloads;
          this.downloads = response.data.downloads.map(
            entry => entry.downloads
          );
          this.labels = response.data.downloads.map(entry => entry.day);
          this.packageName = response.data.package;
          this.formatYear();
          this.setURL();
          this.loaded = true;
        })
        .catch(err => {
          this.errorMessage = err.response.data.error;
          this.showError = true;
        });
    },
    setURL() {
      history.pushState(
        { info: `npm-stats ${this.package}` },
        this.package,
        `/#/${this.package}`
      );
    },
    formatYear() {
      this.labelsYear = this.rawData
        .map(entry => dateToYear(entry.day))
        .reduce(removeDuplicate, []);
      this.downloadsYear = groupData(this.rawData, dateToYear);
    }
  }
};
