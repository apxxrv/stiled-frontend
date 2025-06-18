import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewPost() {
  const [activeTab, setActiveTab] = useState("Upload Post");
  const [caption, setCaption] = useState("");
  const [taggedPeople, setTaggedPeople] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUpload = () => {
    console.log("Uploading post:", { selectedImage, caption, taggedPeople });
    router.push('/social');
  };

  const handleImageSelect = () => {
    router.push('/upload-media');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pt-12 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.push('/social')}>
          <ArrowLeft size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">New Post</Text>
        <View className="w-5" />
      </View>

      {/* Tabs */}
      <View className="flex-row p-4 space-x-2">
        {["Upload Post", "Add News"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === tab
                ? "bg-blue-600"
                : "bg-gray-100"
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === tab ? "text-white" : "text-gray-600"
            }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="flex-1 p-4 space-y-6">
        {/* Image Preview */}
        <TouchableOpacity 
          onPress={handleImageSelect}
          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Text className="text-gray-500">Tap to select image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Caption */}
        <View>
          <TextInput
            placeholder="Add a caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
            className="min-h-[80px] text-base"
            textAlignVertical="top"
          />
        </View>

        {/* Tag People */}
        <View className="flex-row items-center space-x-3 py-3 border-t border-gray-100">
          <User size={20} color="#9ca3af" />
          <TextInput
            placeholder="Tag people"
            value={taggedPeople}
            onChangeText={setTaggedPeople}
            className="flex-1 text-base"
          />
        </View>
      </View>

      {/* Upload Button */}
      <View className="p-4">
        <TouchableOpacity
          onPress={handleUpload}
          disabled={!selectedImage}
          className={`w-full py-4 rounded-full ${
            !selectedImage ? 'bg-gray-300' : ''
          }`}
        >
          <LinearGradient
            colors={selectedImage ? ['#2563eb', '#7c3aed'] : ['#d1d5db', '#d1d5db']}
            className="w-full py-4 rounded-full"
          >
            <Text className="text-white text-center text-base font-medium">
              Upload
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}