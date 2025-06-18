import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Star, ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomNavigation } from '@/components/BottomNavigation';
import { mockApi } from '@/lib/mockApi';

export default function StylistProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: mockApi.getStylists,
  });

  const stylist = stylists.find(s => s.id === parseInt(id!));

  const portfolioImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop", 
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  ];

  if (!stylist) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {/* Header with background image */}
        <View className="relative">
          <View className="h-48 overflow-hidden">
            <LinearGradient
              colors={['#581c87', '#be185d']}
              className="h-full w-full opacity-70"
            />
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=300&fit=crop" }}
              className="absolute inset-0 h-full w-full opacity-70"
              resizeMode="cover"
            />
          </View>
          
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-black/20 p-2 rounded-full"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>

          {/* Profile picture and actions */}
          <View className="absolute -bottom-8 left-4 flex-row items-end space-x-4">
            <View className="h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-white">
              <Image
                source={{ uri: stylist.avatar }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-row space-x-2 mb-2">
              <TouchableOpacity className="bg-white border border-gray-300 p-2 rounded">
                <Mail size={16} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-600 px-6 py-2 rounded"
                onPress={() => router.push(`/book/${stylist.id}`)}
              >
                <Text className="text-white font-medium">Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View className="pt-12 px-4 pb-4">
          <Text className="text-2xl font-bold">{stylist.name}</Text>
          
          {/* Stats */}
          <View className="flex-row items-center space-x-6 mt-2">
            <View className="flex-row items-center">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="font-medium ml-1">{stylist.rating}</Text>
              <Text className="text-gray-600 ml-1">({stylist.reviewCount})</Text>
            </View>
            <View>
              <Text className="font-medium">500 <Text className="text-gray-600 font-normal">Posts</Text></Text>
            </View>
            <View>
              <Text className="font-medium">1.2M <Text className="text-gray-600 font-normal">Followers</Text></Text>
            </View>
            <View>
              <Text className="font-medium">1K <Text className="text-gray-600 font-normal">Following</Text></Text>
            </View>
          </View>

          {/* Bio */}
          <View className="mt-4">
            <Text className="text-sm leading-relaxed">
              💒 Your Bridal Beauty Destination 💍🌸 Makeup | Styling | Bridal Prep Experts | ✨ Transforming brides with elegance ✨ New York
            </Text>
            <Text className="text-gray-600 mt-1 text-sm">📍 DM for bookings & inquiries</Text>
            <TouchableOpacity className="flex-row items-center mt-1">
              <Text className="text-blue-600 text-sm">www.allbrides.com</Text>
              <ExternalLink size={12} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio/Tagged Tabs */}
        <View className="border-b border-gray-200">
          <View className="flex-row">
            <TouchableOpacity className="flex-1 py-3 border-b-2 border-blue-600">
              <Text className="text-center text-sm font-medium text-blue-600">Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 py-3">
              <Text className="text-center text-sm font-medium text-gray-600">Tagged</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Grid */}
        <View className="p-1">
          <View className="flex-row flex-wrap">
            {portfolioImages.map((image, index) => (
              <View key={index} className="w-1/3 aspect-square p-0.5">
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="home" />
    </View>
  );
}