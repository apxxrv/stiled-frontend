import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function UploadMedia() {
  const [activeTab, setActiveTab] = useState("Images");

  const images = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
  ];

  const handleImageSelect = (imageUrl: string) => {
    router.push(`/new-post?image=${encodeURIComponent(imageUrl)}`);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 pt-12 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.push('/social')}>
          <ArrowLeft size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        {["Images", "Videos"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 ${
              activeTab === tab ? 'border-b-2 border-blue-600' : ''
            }`}
          >
            <Text className={`text-center text-sm font-medium ${
              activeTab === tab ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Gallery Grid */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageSelect(image)}
              className="w-[32%] aspect-square mb-2 rounded-lg overflow-hidden"
            >
              <Image
                source={{ uri: image }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}