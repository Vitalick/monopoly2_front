<template>
  <div>
    <h1>Ваш игрок</h1>
    <PlayerComponent :player="player" />
    <div v-if="playersOnline && playersOnline.length">
      <h2>Игроки онлайн</h2>
      <div v-for="playerNode in playersOnline" :key="playerNode.username">
        <PlayerComponent :player="playerNode" />
      </div>
    </div>
    <div v-if="playersOffline && playersOffline.length">
      <h2>Игроки оффлайн</h2>
      <div v-for="playerNode in playersOffline" :key="playerNode.username">
        <PlayerComponent :player="playerNode" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import PlayerComponent from "@/components/PlayerComponent.vue";
import { Message } from "@/interfaces/api";

export default {
  name: "Room",
  components: { PlayerComponent },
  computed: {
    ...mapGetters(["player", "playersOnline", "playersOffline"]),
  },
  methods: {},
};
</script>
