const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
    },
    alias: {
      wavesurfer: require.resolve('wavesurfer.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      WaveSurfer: 'wavesurfer.js'
    }),
  ],
};
