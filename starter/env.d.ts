// Declaración mínima de las variables de entorno públicas de Expo.
// Evita depender de @types/node en un proyecto React Native.
declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};
