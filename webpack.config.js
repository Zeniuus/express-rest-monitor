module.exports = {
  entry: {
    entry: './lib/static/js/rest-monitor.js',
  },
  output: {
    path: `${__dirname}/lib/static/js`,
    filename: 'rest-monitor.bundle.js',
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
};
