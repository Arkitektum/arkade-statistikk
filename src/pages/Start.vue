<template>
  <div class='content'>
    <div class='flex'>
      <aside>
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
            >Organization</span>

            <div
              v-if='facets.organization.name'
              v-bind:class='expandedFacets.organizationName ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.organizationName = !expandedFacets.organizationName'
              >Organization name</span>
              <ul class='facets'>
                <li v-for='organizationName in facets.organization.name' v-bind:key='organizationName.id'>
                  <label>
                    <input
                      type='checkbox'
                      v-on:click='toggleSelectedFacet("organizationName", organizationName.id)'
                    >
                    {{ organizationName.name }}
                  </label>
                </li>
              </ul>
            </div>

            <div
              v-if='facets.organization.type'
              v-bind:class='expandedFacets.organizationType ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.organizationType = !expandedFacets.organizationType'
              >Organization type</span>
              <ul class='facets'>
                <li v-for='organizationType in facets.organization.type' v-bind:key='organizationType.id'>
                  <label>
                    <input
                      type='checkbox'
                      v-on:click='toggleSelectedFacet("organizationType", organizationType.id)'
                    >
                    {{ organizationType.name }}
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if='facets && facets.arkadeClient'
            v-bind:class='expandedFacets.arkadeClient ? "expanded" : "collapsed"'
            class='offset-left-0'
          >
            <span
              class='sidebar-element expandable'
              v-on:click='expandedFacets.arkadeClient = !expandedFacets.arkadeClient'
            >Arkade client</span>
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
                  v-bind:key='operatingSystem.id'
                >
                  <label>
                    <input
                      type='checkbox'
                      v-on:click='toggleSelectedFacet("operatingSystem", operatingSystem.id)'
                    >
                    {{ operatingSystem.name }}
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
                  v-bind:key='userInterface.id'
                >
                  <label>
                    <input
                      type='checkbox'
                      v-on:click='toggleSelectedFacet("userInterface", userInterface.id)'
                    >
                    {{ userInterface.name }}
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
                <li v-for='version in facets.arkadeClient.version' v-bind:key='version.id'>
                  <label>
                    <input type='checkbox' v-on:click='toggleSelectedFacet("version", version.id)'>
                    {{ version.name }}
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
              v-if='facets.processingSession.period'
              v-bind:class='expandedFacets.period ? "expanded" : "collapsed"'
              class='offset-left-1'
            >
              <span
                class='sidebar-element expandable'
                v-on:click='expandedFacets.period = !expandedFacets.period'
              >Period</span>
              <div class='facets'>
                <div class='input-group'>
                  <datepicker
                    placeholder='Start Date'
                    v-model='selectedFacets.period.startDate'
                    :disabledDates='{to: new Date(facets.processingSession.period.firstDate), from: new Date(facets.processingSession.period.lastDate)}'
                    name='start-date'
                    class='datepicker'
                  ></datepicker>
                  <button
                    v-on:click='selectedFacets.period.startDate = null'
                    v-bind:disabled='!selectedFacets.period.startDate'
                  >Clear</button>
                </div>
                <div class='input-group'>
                  <datepicker
                    placeholder='End Date'
                    v-model='selectedFacets.period.endDate'
                    :disabledDates='{to: new Date(facets.processingSession.period.firstDate), from: new Date(facets.processingSession.period.lastDate)}'
                    name='end-date'
                    class='datepicker'
                  ></datepicker>
                  <button
                    v-on:click='selectedFacets.period.endDate = null'
                    v-bind:disabled='!selectedFacets.period.endDate'
                  >Clear</button>
                </div>
              </div>
            </div>

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
                  v-bind:key='archiveSource.id'
                >
                  <label>
                    <input
                      type='checkbox'
                      v-on:click='toggleSelectedFacet("archiveSource", archiveSource.id)'
                    >
                    {{ archiveSource.name }}
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
                  v-bind:key='archiveType.id'
                >
                  <label>
                    <input
                      type='checkbox'
                      v-on:click='toggleSelectedFacet("archiveType", archiveType.id)'
                    >
                    {{ archiveType.name }}
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
              v-if='facets && facets.processingSession'
              :firstDate='new Date(facets.processingSession.period.firstDate)'
              :lastDate='new Date(facets.processingSession.period.lastDate)'
              :selectedFacets='selectedFacets'
            ></processing-sessions-by-date>
          </div>
          <div class='card' v-if='selectedCharts.failingTestsByTestId'>
            <failing-tests-by-test-id :selectedFacets='selectedFacets'></failing-tests-by-test-id>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" src="./Start.scss"></style>
<script src="./Start"></script>
