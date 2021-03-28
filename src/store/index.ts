import Vue from "vue";
import Vuex from "vuex";
import { Message, Player } from "@/interfaces/api";

Vue.use(Vuex);

export interface State {
  clientId: number;
  ws: WebSocket | null;
  roomId: number | null;
  rooms: number[];
  playersInRoom: Player[];
  nowStatus: null | "listen" | "playing";
}

export default new Vuex.Store({
  state: {
    clientId: 0,
    ws: null,
    roomId: null,
    rooms: [],
    playersInRoom: [],
    nowStatus: null,
  } as State,
  mutations: {
    SET_CLIENT_ID(state: State, value: number) {
      state.clientId = value;
    },
    SET_WS(state: State, value: WebSocket) {
      state.ws = value;
    },
    MESSAGE_PROCESSING(state: State, value: string) {
      const msgObj: Message = JSON.parse(value);
      if (msgObj.msgType === "available_rooms") {
        state.rooms = msgObj.rooms ? msgObj.rooms : [];
      } else if (msgObj.msgType === "connected_to_room") {
        const roomId: number | null = msgObj.roomId ? msgObj.roomId : null;
        if (roomId) {
          state.roomId = roomId;
          state.nowStatus = "playing";
          state.rooms = [];
        }
      } else if (msgObj.msgType === "disconnected_from_room") {
        state.roomId = null;
        state.nowStatus = null;
        state.playersInRoom = [];
      } else if (msgObj.msgType === "update_room") {
        state.playersInRoom = msgObj.players ? msgObj.players : [];
      } else if (msgObj.msgType === "connected_to_room_for_listen") {
        const roomId: number | null = msgObj.roomId ? msgObj.roomId : null;
        if (roomId) {
          state.roomId = roomId;
          state.nowStatus = "listen";
        }
      } else if (msgObj.msgType === "disconnected_from_room_for_listen") {
        state.roomId = null;
        state.nowStatus = null;
        state.playersInRoom = [];
      }
    },
  },
  actions: {
    async initClientWs({ commit, state }) {
      commit("SET_CLIENT_ID", Date.now());
      const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
      const hostname = window.location.hostname;
      const port = window.location.port;
      const ws = new WebSocket(
        `${wsScheme}://${hostname}:${port}/ws/${state.clientId}`
      );
      ws.onmessage = (event) => commit("MESSAGE_PROCESSING", event.data);
      commit("SET_WS", ws);
    },
    async sendMessage({ state }, message: Message) {
      if (state.ws) state.ws.send(JSON.stringify(message));
    },
  },
  getters: {
    ws: (state) => state.ws,
    clientId: (state) => state.clientId,
    rooms: (state) => state.rooms,
    roomId: (state) => state.roomId,
    nowStatus: (state) => state.nowStatus,
    playersInRoom: (state) => state.playersInRoom,
    player: (state) =>
      state.playersInRoom.find(
        (x: Player) => x.clientId && x.clientId === state.clientId
      ),
    otherPlayers: (state) =>
      state.playersInRoom.filter(
        (x: Player) => !(x.clientId && x.clientId === state.clientId)
      ),
    playersOnline: (state, getters): Player[] =>
      getters.otherPlayers.filter((x: Player) => !!x.clientId),
    playersOffline: (state, getters): Player[] =>
      getters.otherPlayers.filter((x: Player) => !x.clientId),
  },
  modules: {},
});
