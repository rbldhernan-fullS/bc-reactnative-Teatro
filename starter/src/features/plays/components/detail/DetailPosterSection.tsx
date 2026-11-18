// ===== SEMANA 11 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { PhotoPicker } from '../../../venue/components/PhotoPicker';
import { VenueCard } from '../../../venue/components/VenueCard';
import type { Item } from '../../../../types';
import { styles } from './styles';

interface DetailPosterSectionProps {
  id: string;
  imageUri: string;
  hall: Item['hall'];
}

/** Afiche local de la obra y ficha de la sede. */
export function DetailPosterSection({
  id,
  imageUri,
  hall,
}: DetailPosterSectionProps): React.JSX.Element {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Afiche de la obra</Text>
        <PhotoPicker targetId={id} fallbackUri={imageUri} showPreview={false} />
      </View>

      <VenueCard hall={hall} />
    </>
  );
}
// ===== SEMANA 11 · FIN =====
