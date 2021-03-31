<template>
  <div class="player">
    <div class="data">
      <span class="title"
        >{{ player.username }}{{ player.admin ? " (БАНК)" : "" }}: </span
      >{{ player.money }} денег
    </div>
    <div class="data small" v-if="player.clientId">
      <span class="title">ID: </span>{{ player.clientId }}
    </div>
    <div class="data small" v-else-if="forList">
      <span class="title">СВОБОДЕН</span>
    </div>
    <div v-if="!forList">
      <div v-if="playerMy.username !== player.username">
        <form @submit.prevent="user2user">
          <input
            type="number"
            min="1"
            placeholder="Введите сумму"
            v-model="toUser"
          />
          <button :disabled="!toUser || toUser <= 0 || toUser > playerMy.money">
            Отправить
          </button>
        </form>
      </div>
      <div v-if="playerMy.username === player.username">
        <form @submit.prevent="user2bank">
          <input
            type="number"
            min="1"
            placeholder="Введите сумму"
            v-model="toBank"
          />
          <button :disabled="!toBank || toBank <= 0 || toBank > playerMy.money">
            В банк
          </button>
        </form>
      </div>
      <div v-if="playerMy.admin">
        <form @submit.prevent="bank2user">
          <input
            type="number"
            min="1"
            placeholder="Введите сумму"
            v-model="fromBank"
          />
          <button :disabled="!fromBank || fromBank <= 0">Из банка</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Message, Player } from "@/interfaces/api";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PlayerComponent",
  props: {
    player: Object as () => Player,
    forList: Boolean,
  },
  data() {
    let toBank: number | null = null;
    let fromBank: number | null = null;
    let toUser: number | null = null;
    return {
      toBank: toBank,
      fromBank: fromBank,
      toUser: toUser,
    };
  },
  computed: {
    ...mapGetters({ playerMy: "player" }),
  },
  methods: {
    ...mapActions(["sendMessage"]),
    user2user() {
      if (!this.toUser || this.toUser <= 0 || this.toUser > this.playerMy.money)
        return;
      let message: Message = {
        msgType: "user2user_money",
        toUsername: this.player.username,
        amount: this.toUser,
      };
      this.sendMessage(message);
      this.toUser = null;
    },
    user2bank() {
      if (!this.toBank || this.toBank <= 0 || this.toBank > this.playerMy.money)
        return;
      let message: Message = {
        msgType: "user2bank_money",
        amount: this.toBank,
      };
      this.sendMessage(message);
      this.toBank = null;
    },
    bank2user() {
      if (!this.fromBank || this.fromBank <= 0) return;
      let message: Message = {
        msgType: "bank2user_money",
        toUsername: this.player.username,
        amount: this.fromBank,
      };
      this.sendMessage(message);
      this.fromBank = null;
    },
  },
};
</script>
