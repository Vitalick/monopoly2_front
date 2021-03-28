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
        <form
          @submit.prevent="
            toUser && toUser > 0 && toUser <= playerMy.money
              ? user2user(player.username, toUser)
              : null
          "
        >
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
        <form
          @submit.prevent="
            toBank && toBank > 0 && toBank <= playerMy.money
              ? user2bank(toBank)
              : null
          "
        >
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
        <form
          @submit.prevent="
            fromBank && fromBank > 0
              ? bank2user(player.username, fromBank)
              : null
          "
        >
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
import { Message, Player as PlayerT } from "@/interfaces/api";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Player",
  props: {
    player: PlayerT,
    forList: Boolean,
  },
  data() {
    let toBank: number | null;
    let fromBank: number | null;
    let toUser: number | null;
    return {
      toBank,
      fromBank,
      toUser,
    };
  },
  computed: {
    ...mapGetters({ playerMy: "player" }),
  },
  methods: {
    ...mapActions(["sendMessage"]),
    user2user(username: string, amount: number) {
      let message: Message = {
        msgType: "user2user_money",
        toUsername: username,
        amount: amount,
      };
      this.sendMessage(message);
    },
    user2bank(amount: number) {
      let message: Message = {
        msgType: "user2bank_money",
        amount: amount,
      };
      this.sendMessage(message);
    },
    bank2user(username: string, amount: number) {
      let message: Message = {
        msgType: "bank2user_money",
        toUsername: username,
        amount: amount,
      };
      this.sendMessage(message);
    },
  },
};
</script>

<style scoped>
div.player {
  margin-top: 5px;
}

.title {
  font-weight: bold;
}

.small {
  font-size: 0.7rem;
}

.data {
  margin-bottom: 10px;
}
</style>
