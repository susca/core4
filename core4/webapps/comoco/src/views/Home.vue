<template>
  <c4-page>
    <v-layout column>
      <v-flex>
        <v-layout row wrap xs12>
          <v-flex v-for="(states, group) in groupsJobsByStates" :key="group" class="ma-2 flex-equal-size">
            <board xs12 md4 lg4 xl4 :name="group" :flags="flags" :states="states" class="pa-3"></board>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex ma-2 hidden-sm-and-down>
        <stock-chart></stock-chart>
      </v-flex>
    </v-layout>
  </c4-page>
</template>

<script>
import { groupsJobsByStates, jobFlags } from '../settings'

import Board from '@/components/Board'
import stockChart from '@/components/StockChart'

export default {
  name: 'home',
  components: {
    Board, stockChart
  },
  data () {
    return {
      groupsJobsByStates: groupsJobsByStates, // {waiting: [pending, ..., failed], running: [running], stopped: [error, ..., killed]
      flags: jobFlags // Z R N K
    }
  }
}
</script>

<style scoped lang="scss">
.flex-equal-size {
  flex: 1 1 0;
}
</style>
