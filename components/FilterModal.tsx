import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FilterModal({ visible, onClose }: FilterModalProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const styles = [
    "Luxury & High Fashion",
    "Streetwear", 
    "Minimalist & Chic",
    "Avant-Garde"
  ];

  const services = [
    "Wardrobe Makeover",
    "Event Styling",
    "Photoshoot Styling", 
    "Student & Budget Styling"
  ];

  const toggleSelection = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const CheckboxItem = ({ item, selected, onToggle }: { item: string; selected: boolean; onToggle: () => void }) => (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center space-x-2 py-3">
      <View className={`h-4 w-4 rounded border ${selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
      <Text className="text-sm">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold">Filter by</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="space-y-6">
            {/* Location */}
            <View>
              <Text className="mb-3 font-medium">Location</Text>
              <View className="relative">
                <Search size={16} color="#9ca3af" className="absolute left-3 top-3 z-10" />
                <TextInput
                  placeholder="Search Location"
                  className="pl-10 pr-4 py-3 bg-gray-100 rounded-md"
                />
              </View>
            </View>

            {/* Style Preference */}
            <View>
              <Text className="mb-3 font-medium">Style Preference</Text>
              <View>
                {styles.map((style) => (
                  <CheckboxItem
                    key={style}
                    item={style}
                    selected={selectedStyles.includes(style)}
                    onToggle={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                  />
                ))}
              </View>
            </View>

            {/* Service */}
            <View>
              <Text className="mb-3 font-medium">Service</Text>
              <View>
                {services.map((service) => (
                  <CheckboxItem
                    key={service}
                    item={service}
                    selected={selectedServices.includes(service)}
                    onToggle={() => toggleSelection(service, selectedServices, setSelectedServices)}
                  />
                ))}
              </View>
            </View>

            {/* Reviews */}
            <View>
              <Text className="mb-3 font-medium">Reviews</Text>
              <View className="h-12 bg-gray-100 rounded" />
            </View>
          </View>
        </ScrollView>

        <View className="flex-row space-x-3 p-4 border-t border-gray-200">
          <TouchableOpacity 
            onPress={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg"
          >
            <Text className="text-center font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onClose}
            className="flex-1 py-3 bg-blue-600 rounded-lg"
          >
            <Text className="text-center font-medium text-white">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}