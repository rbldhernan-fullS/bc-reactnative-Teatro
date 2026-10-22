import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardGenre}>{item.genre} · {item.date}</Text>
          <Text style={styles.cardPrice}>${item.price.toLocaleString('es-CO')}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#221116',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4a2a32',
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 16,
    gap: 4,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5ecd9',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#b8a58a',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardGenre: {
    fontSize: 13,
    color: '#b8a58a',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4a24c',
  },
});


// Revisado Semana 1