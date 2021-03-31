<template>
  <div id="app">
    <img src="@/assets/monopoly.png" alt="" />
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

export default Vue.extend({
  name: "Home",
  computed: {
    ...mapGetters(["ws", "clientId"]),
  },
  methods: {
    ...mapActions(["initClientWs"]),
  },
  mounted() {
    this.initClientWs();
  },
});
</script>

<style lang="scss">
@import "styles/main";
</style>
