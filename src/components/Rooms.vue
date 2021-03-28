<template>
  <div class="rooms">
    <h2>
      {{ rooms && rooms.length ? "Доступные комнаты" : "Нет открытых комнат" }}
    </h2>
    <h3>
      {{
        rooms && rooms.length
          ? "Выберите комнату или создайте новую"
          : "Создайте новую комнату"
      }}
    </h3>
    <form @submit.prevent="canLogIn ? enterToRoom() : null">
      <div v-if="rooms && rooms.length">
        <div v-for="room in rooms" :key="room">
          <label>
            <input
              type="radio"
              name="room"
              :value="`room_${room}`"
              v-model="chosenRoom"
              @click="roomIdInput = room"
            />
            {{ room }}
          </label>
        </div>
      </div>
      <div>
        <div>
          <label>
            <input
              type="radio"
              name="room"
              value="typed_room"
              v-model="chosenRoom"
            />
            <input
              type="number"
              v-model="roomIdInput"
              min="1"
              placeholder="Номер комнаты"
              @click="chosenRoom = 'typed_room'"
            />
          </label>
        </div>
      </div>

      <h3>
        {{
          playersInRoom && playersInRoom.length
            ? "Выберите игрока или создайте нового"
            : "Создайте нового игрока"
        }}
      </h3>
      <div v-if="playersInRoom && playersInRoom.length">
        <div v-for="player in playersInRoom" :key="player.username">
          <div
            :class="{
              selected: player.username === username,
              alert: player.username === username && player.clientId,
              'text-muted': player.clientId,
            }"
          >
            <input
              type="radio"
              name="username"
              :disabled="!!player.clientId"
              :value="`player_${player.username}`"
              v-model="chosenUsername"
              @click="!player.clientId ? (username = player.username) : null"
            />
            <Player :player="player" for-list></Player>
          </div>
        </div>
      </div>
      <div v-else>
        <span v-if="loadingPlayers">Загрузка игроков...</span>
        <span v-else-if="debouncePlayers">Идёт выбор комнаты...</span>
      </div>

      <div>
        <div>
          <label>
            <input
              type="radio"
              name="username"
              value="typed_player"
              v-model="chosenUsername"
            />
            <input
              type="text"
              name="username"
              v-model="username"
              placeholder="Имя игрока"
              @click="chosenUsername = 'typed_player'"
            />
          </label>
        </div>
      </div>
      <div>
        <button :disabled="!canLogIn" type="submit">Войти в комнату</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Message, Player as PlayerT } from "@/interfaces/api";
import { debounce } from "lodash";
import Player from "@/components/Player.vue";

export default Vue.extend({
  name: "Rooms",
  components: { Player },
  // props: {
  //   msg: String,
  // },
  data: () => {
    let roomIdInput: number | undefined;
    let username = "";
    let chosenRoom = "typed_room";
    let chosenUsername = "typed_player";
    return {
      debouncePlayers: false,
      loadingPlayers: false,
      chosenRoom,
      chosenUsername,
      roomIdInput,
      username,
    };
  },
  computed: {
    ...mapGetters(["rooms", "nowStatus", "playersInRoom", "roomId"]),
    rightUsername() {
      return !this.playersInRoom.find(
        (x: PlayerT) => x.username === this.username && x.clientId
      );
    },
    canLogIn() {
      return this.roomIdInput && this.rightUsername && !this.loadingPlayers;
    },
  },
  methods: {
    ...mapActions(["sendMessage"]),
    enterToRoom() {
      console.log("enter");
      if (this.roomIdInput) {
        let message: Message = {
          msgType: "connect_to_room",
          roomId: this.roomIdInput,
          username: this.username,
        };
        this.sendMessage(message);
      }
    },
    listenRoom() {
      this.debouncePlayers = false;
      this.loadingPlayers = true;
      if (this.roomIdInput) {
        let message: Message = {
          msgType: "connect_to_room_for_listen",
          roomId: this.roomIdInput,
        };
        this.sendMessage(message);
      }
    },
  },
  created() {
    this.debouncedListenRoom = debounce(this.listenRoom, 500);
  },
  watch: {
    roomIdInput(newVal, oldVal) {
      if (this.roomId) {
        let message: Message = {
          msgType: "disconnect_from_room_for_listen",
        };
        this.sendMessage(message);
      }
      this.debouncePlayers = true;
      this.debouncedListenRoom();
    },
    playersInRoom() {
      this.loadingPlayers = false;
    },
    nowStatus() {
      this.debouncePlayers = false;
      this.loadingPlayers = false;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.text-muted {
  color: gray;
}
.selected {
  background: #2c3e50;
  border-radius: 5px;
  color: white;
}
.alert {
  background: darkred;
}
</style>
