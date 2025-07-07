import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';

interface GradientButtonProps {
  onPress: () => void;
  disabled?: boolean;
  colors: [string, string];
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  textClassName?: string;
}

export default function GradientButton({
  onPress,
  disabled = false,
  colors,
  children,
  className = 'rounded-full p-5',
  style,
  textClassName = 'text-center text-2xl font-black text-white',
}: GradientButtonProps) {
  const buttonColors = disabled ? ['#D1D5DB', '#9CA3AF'] : colors;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <LinearGradient colors={buttonColors} className={className} style={style}>
        {typeof children === 'string' ? (
          <Text className={textClassName}>{children}</Text>
        ) : (
          children
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
