<template>
  <div class='content'>
    <div class='container'>
      <div class='title-container'>
        <h1 class='title' v-if='loaded'>Processing sessions</h1>
        <span class='subtitle'>Processing sessions per day</span>
      </div>
      <div class='Chart__container' v-if='loaded'>
        <div class='Chart__title'></div>
        <div class='Chart__content'>
          <line-chart v-if='loaded' :chart-data='chart.data' :chart-labels='chart.labels'></line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./ProcessingSessionsByDate.scss"></style>
<script src="./ProcessingSessionsByDate"></script>
