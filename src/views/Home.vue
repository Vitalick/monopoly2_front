<template>
  <div>
    <!--    <h1>-->
    <!--      Мой ID:-->
    <!--      {{ clientId ? clientId : "Загрузка" }}-->
    <!--    </h1>-->
    <Rooms v-if="nowStatus !== 'playing'" />
    <Room v-else />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Message } from "@/interfaces/api";
import Rooms from "@/components/Rooms.vue";
import Room from "@/components/Room.vue";

export default Vue.extend({
  name: "Home",
  components: { Room, Rooms },
  computed: {
    ...mapGetters(["ws", "clientId", "rooms", "nowStatus"]),
  },
});
</script>
