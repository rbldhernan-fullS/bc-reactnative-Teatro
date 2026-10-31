module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated 4 usa el plugin de Worklets. La rúbrica de la semana 10
      // menciona 'react-native-reanimated/plugin' (API de Reanimated 2/3),
      // pero en Reanimated 4 el plugin correcto es este y debe ir al final.
      'react-native-worklets/plugin',
    ],
  };
};
