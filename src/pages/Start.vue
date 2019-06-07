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
                  v-bind:key='operatingSystem.id'
                >
                  <label>
                    <input type='checkbox' v-on:click='toggleSelectedFacet("operatingSystem", operatingSystem.id)'>
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
                    <input type='checkbox' v-on:click='toggleSelectedFacet("userInterface", userInterface.id)'>
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
                    <input type='checkbox' v-on:click='toggleSelectedFacet("archiveSource", archiveSource.id)'>
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
                    <input type='checkbox' v-on:click='toggleSelectedFacet("archiveType", archiveType.id)'>
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

<style lang="scss" src="./Start.scss"></style>
<script src="./Start"></script>
