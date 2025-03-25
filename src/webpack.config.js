const path = require('path');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};