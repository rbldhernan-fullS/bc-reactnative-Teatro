// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 02 · INICIO =====
import { COLORS } from './src/theme';
// ===== SEMANA 02 · FIN =====

// ===== SEMANA 01 · INICIO =====
export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <HomeScreen />
    </SafeAreaView>
  );
}
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 02 · INICIO =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
// ===== SEMANA 02 · FIN =====
