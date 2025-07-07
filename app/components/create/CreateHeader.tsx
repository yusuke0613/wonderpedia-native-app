import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../ui/BackButton';
import { CreateType } from '../../constants/createTypes';

interface CreateHeaderProps {
  createType: CreateType;
  onBack: () => void;
}

export default function CreateHeader({ createType, onBack }: CreateHeaderProps) {
  const renderIcon = (size: number = 50) => {
    const color = 'white';

    switch (createType.iconFamily) {
      case 'ionicons':
        return <Ionicons name={createType.icon as any} size={size} color={color} />;
      case 'material':
        return <MaterialCommunityIcons name={createType.icon as any} size={size} color={color} />;
      case 'fontawesome':
        return <FontAwesome5 name={createType.icon as any} size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View className="px-6 py-4">
      <BackButton onPress={onBack} />

      <View className="mt-8 items-center">
        <LinearGradient colors={createType.colors} className="mb-3 rounded-full p-4">
          {renderIcon()}
        </LinearGradient>
        <Text className="text-primary-800 text-3xl font-bold">{createType.title}</Text>
        <Text className="text-primary-700 mt-1 text-lg">{createType.subtitle}</Text>
      </View>
    </View>
  );
}
