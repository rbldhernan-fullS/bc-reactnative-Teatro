// ===== SEMANA 04 · INICIO =====
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

interface PressableCardProps {
  children: ReactNode;
  action: ReactNode;
  label: string;
  onPress: () => void;
  cardStyle: StyleProp<ViewStyle>;
  pressedStyle: StyleProp<ViewStyle>;
  layoutStyle?: StyleProp<ViewStyle>;
}

export function PressableCard({
  children,
  action,
  label,
  onPress,
  cardStyle,
  pressedStyle,
  layoutStyle,
}: PressableCardProps): React.JSX.Element {
  return (
    <View style={layoutStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && pressedStyle]}
      >
        {children}
      </Pressable>
      {action}
    </View>
  );
}
// ===== SEMANA 04 · FIN =====
