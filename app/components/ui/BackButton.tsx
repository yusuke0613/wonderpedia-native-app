import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export default function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute left-4 top-4 z-10 rounded-full bg-white/80 p-2"
      style={style}>
      <Ionicons name="arrow-back" size={24} color="#374151" />
    </TouchableOpacity>
  );
}
