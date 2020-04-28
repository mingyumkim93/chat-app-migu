module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://chat-app-migu.herokuapp.com/",
        ws: true,
        changeOrigin: true
      }
    }
  }
};
