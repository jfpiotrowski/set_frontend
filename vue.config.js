module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/ws': {
        target: 'http://localhost:3000',
        ws: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
