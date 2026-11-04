// ===== SEMANA 01 · INICIO =====
import React from 'react';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { NavigationContainer } from '@react-navigation/native';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 01 · INICIO =====
import { StatusBar } from 'expo-status-bar';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 01 · INICIO =====
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      {/* ===== SEMANA 03 · INICIO ===== */}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      {/* ===== SEMANA 03 · FIN ===== */}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
// ===== SEMANA 01 · FIN =====
