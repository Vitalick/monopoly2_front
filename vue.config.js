// eslint-disable-next-line no-unused-vars
// const BASE_URL = "http://127.0.0.1:8000/";
const BASE_URL_WS = "ws://127.0.0.1:8000/";

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    port: "8070",
    host: "0.0.0.0",
    hot: true,
    // disableHostCheck: true,
    proxy: {
      "/ws/": {
        target: BASE_URL_WS,
        changeOrigin: true,
        logLevel: "debug",
        ws: true
      }
    }
  }
};
