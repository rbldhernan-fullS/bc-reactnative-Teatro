// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { Platform, Pressable, Text, TextInput } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { COLORS } from '../../../../theme';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 02 · INICIO =====
import { styles } from './styles';

interface HomeSearchBarProps {
  query: string;
  onChangeQuery: (value: string) => void;
  inputRef: React.RefObject<TextInput | null>;
}

/** Caja de búsqueda de la cartelera: filtra por obra, director o género. */
export function HomeSearchBar({
  query,
  onChangeQuery,
  inputRef,
}: HomeSearchBarProps): React.JSX.Element {
  const clearQuery = (): void => {
    onChangeQuery('');
    inputRef.current?.focus();
  };

  return (
    <Pressable style={styles.searchInputWrapper} onPress={() => inputRef.current?.focus()}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder="Buscar por obra, director o género..."
        placeholderTextColor={COLORS.textMuted}
        maxLength={80}
        value={query}
        onChangeText={onChangeQuery}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {Platform.OS !== 'ios' && query.length > 0 && (
        <Pressable
          onPress={clearQuery}
          style={styles.clearIconWrapper}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Borrar búsqueda"
        >
          <Text style={styles.clearIconText}>✕</Text>
        </Pressable>
      )}
    </Pressable>
  );
}
// ===== SEMANA 02 · FIN =====
