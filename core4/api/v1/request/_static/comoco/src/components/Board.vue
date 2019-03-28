<template>
  <v-container class="board">
    <board-header :name="name" :states="states"></board-header>
    <v-layout column class="jobs">
      <v-flex v-for="(job, index) in getJobsByGroupName(name)" :key="index">
        <job :flags="flags" :job="job"></job>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import Job from '@/components/Job'
import BoardHeader from '@/components/BoardHeader'

export default {
  name: 'jobsBoard',
  components: {
    Job, BoardHeader
  },
  props: ['name', 'states', 'flags'],
  computed: {
    ...mapGetters(['getJobsByGroupName'])
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
@import '../assets/comoco';

$scrollbar-track: #4A4A4A;
$scrollbar-thumb: #5C5C5C;
$scrollbar-thumb-hover: #737373;

.board {
  background-color: $jobs-board-bck-color;
  min-width: 230px;
  height: 100%;
}

.jobs {
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar-track {
    background-color: $scrollbar-track;
  }

  &::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $scrollbar-thumb;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: $scrollbar-thumb-hover;
  }
}

/*
  ## Device = 4k and ultra-wides
  ## Screen = > 1904px
*/
@media (min-width: 1281px)and (max-width: 1904px) {
  .jobs {
    max-height: calc(100vh - 620px);
  }
}

/*
  ## Device = Desktop
  ## Screen = 1264 > < 1904px
*/
@media (min-width: 1281px)and (max-width: 1904px) {
  .jobs {
    max-height: calc(100vh - 620px);
  }
}

/*
  ## Device = Large tablet to laptop
  ## Screen = 960px > < 1264px
*/
@media (min-width: 960px) and (max-width: 1264px) {
  .jobs {
    max-height: calc(100vh - 620px);
  }
}

/*
  ## Device = Small to medium tablet
  ## Screen = 600px > < 960px
*/
@media (min-width: 600px) and (max-width: 960px) {
  .jobs {
    max-height: calc(100vh - 220px);
  }
}

/*
  ## Device = Small to large handset
  ## Screen = < 600px
*/
@media (max-width: 600px) {
  .jobs {
    max-height: calc(100vh - 220px);
  }
}
</style>
