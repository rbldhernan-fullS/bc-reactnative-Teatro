// ===== SEMANA 10 · INICIO =====
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};
// ===== SEMANA 10 · FIN =====
