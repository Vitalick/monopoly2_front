<template>
  <div>
    <h1>Ваш игрок</h1>
    <Player :player="player" />
    <div v-if="playersOnline && playersOnline.length">
      <h2>Игроки онлайн</h2>
      <div v-for="playerNode in playersOnline" :key="playerNode.username">
        <Player :player="playerNode" />
      </div>
    </div>
    <div v-if="playersOffline && playersOffline.length">
      <h2>Игроки оффлайн</h2>
      <div v-for="playerNode in playersOffline" :key="playerNode.username">
        <Player :player="playerNode" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import Player from "@/components/Player";
import { Message } from "@/interfaces/api";

export default {
  name: "Room",
  components: { Player },
  computed: {
    ...mapGetters(["player", "playersOnline", "playersOffline"]),
  },
  methods: {},
};
</script>

<style scoped></style>
