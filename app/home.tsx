import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Search, Bell, Menu, Filter, Star } from 'lucide-react-native';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FilterModal } from '@/components/FilterModal';
import { mockApi } from '@/lib/mockApi';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const { data: stylists = [], isLoading } = useQuery({
    queryKey: ['stylists'],
    queryFn: mockApi.getStylists,
  });

  const categories = ["All", "Clothing", "Casual", "Formal", "More"];

  const StylistCard = ({ stylist }: { stylist: any }) => (
    <TouchableOpacity 
      className="w-[48%] mb-4"
      onPress={() => router.push(`/stylist/${stylist.id}`)}
    >
      <View className="bg-white rounded-lg overflow-hidden shadow-sm">
        <View className="aspect-square overflow-hidden">
          <Image
            source={{ uri: stylist.avatar }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>
        <View className="p-4">
          <Text className="font-semibold">{stylist.name}</Text>
          <Text className="text-sm text-gray-600">{stylist.followers}k Followers</Text>
          <View className="flex-row items-center mt-2">
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-sm font-medium ml-1">{stylist.rating}</Text>
            <Text className="text-sm text-gray-600 ml-1">({stylist.reviewCount})</Text>
          </View>
          <TouchableOpacity 
            className="w-full mt-3 bg-blue-600 py-2 rounded-md"
            onPress={() => router.push(`/book/${stylist.id}`)}
          >
            <Text className="text-white text-center text-sm font-medium">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 pt-12">
          <Text className="text-lg font-medium tracking-wider">STILED</Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity>
              <Bell size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Menu size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filter */}
        <View className="px-4 pb-4">
          <View className="flex-row space-x-3">
            <View className="flex-1 relative">
              <Search size={16} color="#9ca3af" className="absolute left-3 top-3 z-10" />
              <TextInput
                placeholder="Search"
                className="pl-10 pr-4 py-3 bg-gray-100 rounded-md"
              />
            </View>
            <TouchableOpacity 
              onPress={() => setShowFilter(true)}
              className="p-3 border border-gray-300 rounded-md"
            >
              <Filter size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Friends Banner */}
        <View className="mx-4 mb-6 rounded-xl bg-black p-4">
          <Text className="font-semibold text-white">Invite friends & discover top stylists!</Text>
          <Text className="text-sm text-white opacity-90">Unlock exclusive rewards!</Text>
          <TouchableOpacity className="mt-3 bg-white py-2 px-4 rounded-md self-start">
            <Text className="text-black font-medium">Invite Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-6 px-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-6">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setActiveCategory(category)}
                  className="pb-2"
                >
                  <Text className={`text-sm font-medium ${
                    activeCategory === category ? 'text-black border-b-2 border-black' : 'text-gray-600'
                  }`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Trending Stylists */}
        <View className="px-4 pb-20">
          <Text className="text-lg font-semibold mb-4">Trending Stylists</Text>
          
          {isLoading ? (
            <View className="flex-row flex-wrap justify-between">
              {[1, 2, 3, 4].map((i) => (
                <View key={i} className="w-[48%] aspect-square bg-gray-200 rounded-lg mb-4" />
              ))}
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {stylists.map((stylist) => (
                <StylistCard key={stylist.id} stylist={stylist} />
              ))}
            </View>
          )}

          {/* Suggested Stylists Section */}
          <Text className="text-lg font-semibold mb-4 mt-8">Suggested Stylists</Text>
          <View className="flex-row flex-wrap justify-between">
            {stylists.slice(0, 2).map((stylist) => (
              <StylistCard key={`suggested-${stylist.id}`} stylist={stylist} />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="home" />
      <FilterModal visible={showFilter} onClose={() => setShowFilter(false)} />
    </View>
  );
}