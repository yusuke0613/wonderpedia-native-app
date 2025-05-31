import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

interface StoryViewerHeaderProps {
  title: string;
  currentPage: number;
  totalPages: number;
  onClose: () => void;
}

export const StoryViewerHeader: React.FC<StoryViewerHeaderProps> = ({
  title,
  currentPage,
  totalPages,
  onClose,
}) => {
  return (
    <View style={styles.modalHeader}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <X size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.modalTitle} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>
          {currentPage + 1} / {totalPages}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  pageIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  pageIndicatorText: {
    fontSize: 12,
    color: '#666',
  },
});
