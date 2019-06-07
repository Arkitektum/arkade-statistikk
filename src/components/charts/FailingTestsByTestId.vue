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

<style lang="scss" src="./FailingTestsByTestId.scss"></style>
<script src="./FailingTestsByTestId"></script>
