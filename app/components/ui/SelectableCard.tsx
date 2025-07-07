import { TouchableOpacity, Text, View } from 'react-native';
import { ReactNode } from 'react';

interface SelectableCardProps {
  onPress: () => void;
  selected: boolean;
  children: ReactNode;
  className?: string;
}

export default function SelectableCard({
  onPress,
  selected,
  children,
  className = 'rounded-2xl bg-white p-6',
}: SelectableCardProps) {
  const borderStyle = selected ? 'border-4 border-orange-500' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${className} ${borderStyle}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
      }}>
      {typeof children === 'string' ? (
        <Text className="text-center text-xl font-black text-primary-800">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
