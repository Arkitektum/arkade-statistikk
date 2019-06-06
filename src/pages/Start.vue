<template>
  <div class='content'>
    <div class='navbar'>
      <div class='input-container'>
        <datepicker
          placeholder='Start Date'
          v-model='startDate'
          name='start-date'
          class='datepicker'
        ></datepicker>
        <datepicker placeholder='End Date' v-model='endDate' name='end-date' class='datepicker'></datepicker>
        <label>
          <input type='checkbox' v-on:click='noDate = !noDate' v-bind:checked='noDate'>Lifetime
        </label>
      </div>
    </div>
    <div class='flex'>
      <aside>
        <br>
        <div class='sidebar-element-section offset-left-0'>
          <span class='sidebar-element-section-title'>Charts</span>
          <ul class='facets'>
            <li>
              <label>
                <input type='checkbox' v-model='selectedCharts.processingSessionsByDate'>
                Processing sessions per day
              </label>
            </li>
            <li>
              <label>
                <input type='checkbox' v-model='selectedCharts.failingTestsByTestId'>
                Failing tests per test ID
              </label>
            </li>
          </ul>
        </div>
        <div class='sidebar-element-section'>
          <span class='sidebar-element-section-title'>Filters</span>
          <div
            v-if='facets && facets.organization'
            v-bind:class='expandedFacets.organization ? "expanded" : "collapsed"'
            class='offset-left-0'
          >
            <span
              class='sidebar-element expandable'
              v-on:click='expandedFacets.organization = !expandedFacets.organization'
            >Organization:</span>
            <ul class='facets'>
              <li v-for='organization in facets.organization' v-bind:key='organization.id'>
                <label>
                  <input
                    type='checkbox'
                    v-on:click='toggleSelectedFacet("organization", organization.id)'
                  >
                  {{ organization.name }}
                </label>
              </li>
            </ul>
          </div>

          <div
            v-if='facets && facets.arkadeClient'
            v-bind:class='expandedFacets.arkadeClient ? "expanded" : "collapsed"'
            class='offset-left-0'
          >
            <span
              class='sidebar-element expandable'
              v-on:click='expandedFacets.arkadeClient = !expandedFacets.arkadeClient'
            >Arkade client:</span>
            <div
              v-if='facets.arkadeClient.operatingSystem'
              v-bind:class='expandedFacets.operatingSystem ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.operatingSystem = !expandedFacets.operatingSystem'
              >Operating system</span>
              <ul class='facets'>
                <li
                  v-for='operatingSystem in facets.arkadeClient.operatingSystem'
                  v-bind:key='operatingSystem'
                >
                  <label>
                    <input type='checkbox'>
                    {{ operatingSystem }}
                  </label>
                </li>
              </ul>
            </div>

            <div
              v-if='facets.arkadeClient.userInterface'
              v-bind:class='expandedFacets.userInterface ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.userInterface = !expandedFacets.userInterface'
              >User interface</span>
              <ul class='facets'>
                <li
                  v-for='userInterface in facets.arkadeClient.userInterface'
                  v-bind:key='userInterface'
                >
                  <label>
                    <input type='checkbox'>
                    {{ userInterface }}
                  </label>
                </li>
              </ul>
            </div>

            <div
              v-if='facets.arkadeClient.version'
              v-bind:class='expandedFacets.version ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.version = !expandedFacets.version'
              >Version</span>
              <ul class='facets'>
                <li v-for='version in facets.arkadeClient.version' v-bind:key='version'>
                  <label>
                    <input type='checkbox'>
                    {{ version }}
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if='facets && facets.processingSession'
            class='offset-left-0'
            v-bind:class='expandedFacets.processingSession ? "expanded" : "collapsed"'
          >
            <span
              class='sidebar-element expandable'
              v-on:click='expandedFacets.processingSession = !expandedFacets.processingSession'
            >Processing session</span>

            <div
              v-if='facets.processingSession.archiveSource'
              v-bind:class='expandedFacets.archiveSource ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.archiveSource = !expandedFacets.archiveSource'
              >Archive source</span>
              <ul class='facets'>
                <li
                  v-for='archiveSource in facets.processingSession.archiveSource'
                  v-bind:key='archiveSource'
                >
                  <label>
                    <input type='checkbox'>
                    {{ archiveSource }}
                  </label>
                </li>
              </ul>
            </div>

            <div
              v-if='facets.processingSession.archiveType'
              v-bind:class='expandedFacets.archiveType ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.archiveType = !expandedFacets.archiveType'
              >Archive type</span>
              <ul class='facets'>
                <li
                  v-for='archiveType in facets.processingSession.archiveType'
                  v-bind:key='archiveType'
                >
                  <label>
                    <input type='checkbox'>
                    {{ archiveType }}
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
      <main class='container'>
        <div class='graph-container'>
          <div class='card' v-if='selectedCharts.processingSessionsByDate'>
            <processing-sessions-by-date
              v-bind:start-date='startDate'
              v-bind:end-date='endDate'
              v-bind:selected-facets='selectedFacets'
            ></processing-sessions-by-date>
          </div>
          <div class='card' v-if='selectedCharts.failingTestsByTestId'>
            <failing-tests-by-test-id
              v-bind:start-date='startDate'
              v-bind:end-date='endDate'
              v-bind:selected-facets='selectedFacets'
            ></failing-tests-by-test-id>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import ProcessingSessionsByDate from "../components/charts/ProcessingSessionsByDate";
import FailingTestsByTestId from "../components/charts/FailingTestsByTestId";
import { dateToYear, dateToDay, dateBeautify } from "../utils/dateFormatter";
import { removeDuplicate, groupData } from "../utils/downloadFormatter";
import dummydata from "../data/dummydata.json";
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
        archiveType: []
      },
      expandedFacets: {
        organization: true,
        arkadeClient: true,
        operatingSystem: true,
        userInterface: true,
        version: true,
        processingSession: true,
        archiveSource: true,
        archiveType: true
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
      return this.endDate ? moment(this.endDate).format("YYYY-MM-DD") : null;
    },
    _startDate() {
      return this.startDate
        ? moment(this.startDate).format("YYYY-MM-DD")
        : null;
    },
    period() {
      return this.startDate
        ? `${this._startDate}:${this._endDate}`
        : "last-month";
    },
    formattedPeriod() {
      return this.startDate
        ? `${dateBeautify(this._startDate)} - ${dateBeautify(this._endDate)}`
        : "last-month";
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
      var currDate = moment(startDate).startOf("day");
      var lastDate = moment(endDate).startOf("day");
      while (currDate.add(1, "days").diff(lastDate) < 0) {
        let date = currDate.clone().toDate();
        dates.push(moment(date).format("YYYY-MM-DD"));
      }
      return dates;
    },
    showProcessingSessionsByStartDate() {
      this.chart = this.getProcessingSessionsByDate();
      this.loaded = true;
    },
    pushIfNotExists(array, value) {
      if (array.findIndex(arrayElement => arrayElement === value) === -1) {
        array.push(value);
      }
      return array;
    },
    removeSelectedFacet(facetType, facetId) {
      if (this.selectedFacets[facetType]) {
        const selectedFacetIndex = this.selectedFacets[facetType].indexOf(
          facetId
        );
        if (selectedFacetIndex !== -1)
          this.selectedFacets[facetType].splice(selectedFacetIndex, 1);
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
      if (!this.selectedFacets[facetType]) return false;
      else
        return this.selectedFacets[facetType].filter(selectedFacetId => {
          return facetId === selectedFacetId;
        }).length;
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
          archiveType: []
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
            arkadeClient.operatingSystem
          );
          this.facets.arkadeClient.userInterface = this.pushIfNotExists(
            this.facets.arkadeClient.userInterface,
            arkadeClient.userInterface
          );
          this.facets.arkadeClient.version = this.pushIfNotExists(
            this.facets.arkadeClient.version,
            arkadeClient.version
          );

          arkadeClient.processingSessions.forEach(processingSession => {
            this.facets.processingSession.archiveSource = this.pushIfNotExists(
              this.facets.processingSession.archiveSource,
              processingSession.archiveSource
            );
            this.facets.processingSession.archiveType = this.pushIfNotExists(
              this.facets.processingSession.archiveType,
              processingSession.archiveType
            );
          });
        });
      });
    },
    requestData() {
      if (
        this.package === null ||
        this.package === "" ||
        this.package === "undefined"
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
</script>

<style>
.navbar {
  -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
  -moz-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
  position: fixed;
  background: #fff;
  width: 100%;
  height: 76px;
  top: 0;
}
.content {
  height: 100%;
}
.flex {
  display: flex;
  height: 100%;
}
aside {
  width: 300px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  margin-top: 76px;
  height: calc(100% - 76px);
}
main {
  flex: 1;
  background-color: #f4f4f4;
  height: 100%;
  overflow: auto;
  margin-top: 76px;
  height: calc(100% - 76px);
}
.card {
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 16px;
}

.facets {
  list-style: none;
  margin: 0;
}
.facets li label {
  padding: 0 16px;
  font-size: 12pt;
  display: block;
  cursor: pointer;
}

.sidebar-element {
  line-height: 24pt;
  font-size: 14pt;
  display: block;
  -moz-transition: background-color 0.2s ease-in-out;
  -o-transition: background-color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;
}

.sidebar-element:hover {
  background-color: #f0f1f2;
}

.expandable {
  cursor: pointer;
}

.expandable:before {
  content: "►";
  display: inline-block;
}

.expanded > .expandable:before {
  content: "▼";
  display: inline-block;
}

.collapsed > .facets,
.collapsed > div {
  display: none;
}

.offset-left-0 .sidebar-element,
.offset-left-0 .facets {
  padding-left: 16px;
}
.offset-left-1 .sidebar-element,
.offset-left-1 .facets {
  padding-left: 32px;
}

.input-container {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
.input-container .datepicker {
  display: inline-block;
}
.input-container input {
  padding: 1.25rem;
  background-color: #fff;
  border: 1px solid #e8e9ed;
  font-size: 1rem;
  display: inline-block;
  border: 1px solid #e8e9ed;
}
.graph-container {
  padding: 16px;
}
</style>
