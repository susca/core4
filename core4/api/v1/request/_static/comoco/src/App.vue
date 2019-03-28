<template>
  <pnbi-webapp :full-width="true">
    <side-navigation slot="navigation-slot"></side-navigation>
    <div slot="router">
      <transition name="fade" mode="out-in" :duration="{ enter: 200, leave: 300 }">
        <router-view />
      </transition>
    </div>
  </pnbi-webapp>
</template>

<script>
import SideNavigation from '@/components/SideNavigation'
import { mapGetters } from 'vuex'

const getBasePath = () => {
  if (window.location.href.includes('http')) {
    // index.html
    return window.APIBASE_CORE.replace('http:', 'ws:')
  }

  return `ws://${window.location.hostname}${window.APIBASE_CORE}`
}

const WS_BASE_PATH = getBasePath()

export default {
  name: 'CORE4',
  components: {
    SideNavigation
  },
  computed: {
    ...mapGetters(['authenticated'])
  },
  watch: {
    authenticated (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.$disconnect()

        let token = JSON.parse(localStorage.getItem('user'))['token']
        this.$connect(`${WS_BASE_PATH}/v1/event?token=${token}`)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
