<template>
  <pnbi-page>
    <v-layout column>
      <v-flex>
        <v-layout row wrap xs12>
          <v-flex v-for="(states, group) in jobStates" :key="group" class="ma-2">
            <jobs-board xs12 md4 lg4 xl4 :name="group" :flags="flags" :states="states"></jobs-board>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex ma-2 hidden-sm-and-down>
        <jobs-stat></jobs-stat>
      </v-flex>
    </v-layout>
  </pnbi-page>
</template>

<script>
import { statesByGroup, jobFlags } from '../settings'

import jobsBoard from '@/components/Board'
import JobsStat from '@/components/JobsStat'

export default {
  name: 'home',
  components: {
    jobsBoard, JobsStat
  },
  data () {
    return {
      jobStates: statesByGroup, // pending, running, waiting
      flags: jobFlags // Z R N K
    }
  }
}
</script>

<style scoped lang="scss">

</style>
