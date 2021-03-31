<template>
  <div class="rooms">
    <h3 class="text-gray text-medium">
      Чтобы войти в игру, нужно выбрать доступную комнату или создать новую
    </h3>
    <h1 class="text-uppercase">
      {{ rooms && rooms.length ? "Доступные комнаты" : "Нет открытых комнат" }}
    </h1>
    <h3 class="text-gray text-medium">
      {{
        rooms && rooms.length
          ? "Выберите комнату или создайте новую"
          : "Создайте новую комнату"
      }}
    </h3>
    <p>
      <RadioButtons
        v-if="rooms"
        :options="roomsFormatted"
        v-model="roomIdInput"
      />
    </p>
    <form @submit.prevent="canLogIn ? enterToRoom() : null">
      <div>
        <div>
          <label>
            <input
              type="number"
              v-model="roomIdInputNumber"
              min="1"
              placeholder="Номер комнаты"
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
      <div
        v-if="
          !loadingPlayers &&
          !debouncePlayers &&
          playersInRoom &&
          playersInRoom.length
        "
      >
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
            <PlayerComponent :player="player" for-list></PlayerComponent>
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
        <button :disabled="!canLogIn" class="btn btn-black" type="submit">
          Войти в комнату
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Message, Player as PlayerT } from "@/interfaces/api";
import { debounce } from "lodash";
import PlayerComponent from "@/components/PlayerComponent.vue";
import RadioButtons from "@/components/RadioButtons.vue";

export default Vue.extend({
  name: "Rooms",
  components: { RadioButtons, PlayerComponent },
  // props: {
  //   msg: String,
  // },
  data: () => {
    let roomIdInput: number | null = null;
    let username = "";
    let chosenRoom = "typed_room";
    let chosenUsername = "typed_player";
    const out = {
      debouncePlayers: false,
      loadingPlayers: false,
      chosenUsername,
      roomIdInput,
      username,
    };
    return out;
  },
  computed: {
    ...mapGetters(["rooms", "nowStatus", "playersInRoom", "roomId"]),
    roomIdInputNumber: {
      get() {
        return this.roomIdInput;
      },
      set(val) {
        this.roomIdInput = val ? Number(val) : null;
      },
    },
    rightUsername() {
      return !this.playersInRoom.find(
        (x: PlayerT) => x.username === this.username && x.clientId
      );
    },
    canLogIn() {
      return (
        this.roomIdInput &&
        this.username &&
        this.rightUsername &&
        !this.loadingPlayers
      );
    },
    roomsFormatted() {
      return this.rooms.map((val) => ({ title: val.toString(), value: val }));
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
      if (this.roomIdInput === this.roomId) return;
      this.loadingPlayers = true;
      if (this.roomIdInput && this.roomIdInput !== this.roomId) {
        let message: Message = {
          msgType: "connect_to_room_for_listen",
          roomId: this.roomIdInput,
        };
        this.sendMessage(message);
      } else {
        if (!this.roomIdInput && this.roomId) {
          let message: Message = {
            msgType: "disconnect_from_room",
          };
          this.sendMessage(message);
        }
        this.loadingPlayers = false;
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
