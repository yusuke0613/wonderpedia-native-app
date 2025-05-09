import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Platform
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { User, Plus, UserPlus, ChevronDown } from 'lucide-react-native';

export default function ChildSwitcher() {
  const { children, selectedChild, selectChild, addChild } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  
  // Avatar options for new child
  const avatarOptions = ['boy', 'girl', 'cat', 'dog', 'robot'];
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  
  if (!selectedChild) {
    return null;
  }
  
  const handleSelectChild = (child: typeof children[0]) => {
    selectChild(child);
    setModalVisible(false);
  };
  
  const handleAddChild = () => {
    if (newChildName.trim() === '' || newChildAge.trim() === '') {
      return;
    }
    
    const age = parseInt(newChildAge);
    if (isNaN(age) || age < 1 || age > 12) {
      return;
    }
    
    addChild(newChildName, age, selectedAvatar)
      .then(() => {
        setNewChildName('');
        setNewChildAge('');
        setSelectedAvatar(avatarOptions[0]);
        setAddModalVisible(false);
      });
  };
  
  // Get avatar placeholder for the selected child
  const getAvatarPlaceholder = (avatar: string) => {
    return avatar.charAt(0).toUpperCase();
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.childSelector}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {getAvatarPlaceholder(selectedChild.name)}
          </Text>
        </View>
        <Text style={styles.childName}>{selectedChild.name}</Text>
        <ChevronDown size={16} color={Colors.text} />
      </TouchableOpacity>
      
      {/* Child Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Child</Text>
            
            <FlatList
              data={children}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.childItem,
                    selectedChild.id === item.id && styles.selectedChildItem
                  ]}
                  onPress={() => handleSelectChild(item)}
                >
                  <View style={styles.childItemAvatar}>
                    <Text style={styles.childItemAvatarText}>
                      {getAvatarPlaceholder(item.name)}
                    </Text>
                  </View>
                  <View style={styles.childItemInfo}>
                    <Text style={styles.childItemName}>{item.name}</Text>
                    <Text style={styles.childItemAge}>{item.age} years old</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.addChildButton}
              onPress={() => {
                setModalVisible(false);
                setAddModalVisible(true);
              }}
            >
              <UserPlus size={20} color={Colors.white} />
              <Text style={styles.addChildButtonText}>Add Child</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Add Child Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Child</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={newChildName}
                onChangeText={setNewChildName}
                placeholder="Child's name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={newChildAge}
                onChangeText={setNewChildAge}
                placeholder="Child's age (1-12)"
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Avatar</Text>
              <View style={styles.avatarOptions}>
                {avatarOptions.map((avatar) => (
                  <TouchableOpacity
                    key={avatar}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === avatar && styles.selectedAvatarOption
                    ]}
                    onPress={() => setSelectedAvatar(avatar)}
                  >
                    <Text style={styles.avatarOptionText}>
                      {avatar.charAt(0).toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.addButton,
                (!newChildName.trim() || !newChildAge.trim()) && styles.disabledButton
              ]}
              onPress={handleAddChild}
              disabled={!newChildName.trim() || !newChildAge.trim()}
            >
              <Text style={styles.addButtonText}>Add Child</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
    color: Colors.primary,
  },
  childName: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: Platform.OS === 'web' ? 400 : '80%',
    maxHeight: '80%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  selectedChildItem: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  childItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childItemAvatarText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  childItemInfo: {
    flex: 1,
  },
  childItemName: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    marginBottom: 2,
  },
  childItemAge: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.darkGray,
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  addChildButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  closeButton: {
    paddingVertical: 8,
    marginTop: 8,
  },
  closeButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.darkGray,
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    fontFamily: 'ComicNeue-Regular',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  avatarOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  selectedAvatarOption: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarOptionText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
  },
  addButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
});