import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react-native';
import { BottomNavigation } from '@/components/BottomNavigation';
import { CommentsModal } from '@/components/CommentsModal';
import { mockApi } from '@/lib/mockApi';

export default function Social() {
  const [activeTab, setActiveTab] = useState("Feeds");
  const [selectedPost, setSelectedPost] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: mockApi.getPosts,
  });

  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: mockApi.getStylists,
  });

  const PostCard = ({ post }: { post: any }) => {
    const stylist = stylists.find(s => s.id === post.stylistId);
    
    return (
      <View className="bg-white border-b border-gray-100">
        {/* Post header */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center space-x-3">
            <View className="h-10 w-10 rounded-full bg-black items-center justify-center">
              <Text className="text-white text-sm font-medium">
                {stylist?.name.substring(0, 1) || "G"}
              </Text>
            </View>
            <View>
              <View className="flex-row items-center space-x-2">
                <Text className="font-medium">our_george</Text>
                <TouchableOpacity className="px-2 py-1 border border-gray-300 rounded">
                  <Text className="text-xs">Follow</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500">1 min ago</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MoreHorizontal size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Post content */}
        <View className="px-4 pb-3">
          <Text className="text-sm">{post.content}</Text>
        </View>

        {/* Post image */}
        {post.image && (
          <View className="aspect-square">
            <Image
              source={{ uri: post.image }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Post actions */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity>
              <Heart size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedPost(post)}>
              <MessageCircle size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Bookmark size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Attribution */}
        <View className="px-4 pb-4">
          <View className="flex-row items-center space-x-2">
            <View className="h-4 w-4 rounded-full bg-black items-center justify-center">
              <Text className="text-white text-xs">G</Text>
            </View>
            <Text className="text-xs font-medium">our_george</Text>
            <TouchableOpacity className="ml-auto">
              <MoreHorizontal size={12} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const NewsCard = ({ news }: { news: any }) => (
    <View className="bg-white border-b border-gray-100 p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-3">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=face" }}
            className="h-8 w-8 rounded-full"
          />
          <View>
            <Text className="font-medium text-sm">{news.author}</Text>
            <Text className="text-xs text-gray-500">1 min ago</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <View className="mb-3">
        <Text className="font-medium mb-2">{news.title}</Text>
        <Text className="text-sm text-gray-700 leading-relaxed">{news.content}</Text>
        {news.hashtags && (
          <Text className="text-sm text-blue-600 mt-2">{news.hashtags}</Text>
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity>
            <Heart size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MessageCircle size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Bookmark size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const newsItems = [
    {
      id: 1,
      author: "Etheral Fashion",
      title: "🎥New Virtual Consultation Tool📹",
      content: "We're excited to introduce Virtual Styling Consultations! Now, clients can book virtual sessions with their favorite stylists via video calls. Upgrade your profile today and start offering virtual services!",
      hashtags: "#StylistTools #VirtualStyling"
    },
    {
      id: 2,
      author: "STILED",
      title: "Great news!",
      content: "The STILED Referral Program is now live. Invite your stylist friends and earn exclusive perks for each successful signup!",
      hashtags: ""
    }
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200 bg-white pt-12">
        <View className="px-4 py-3">
          <Text className="text-center text-lg font-semibold">Social Feed</Text>
        </View>
        
        {/* Tabs */}
        <View className="flex-row">
          {["Feeds", "News"].map((tab) => (
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
      </View>

      {/* Content */}
      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {activeTab === "Feeds" ? (
          isLoading ? (
            <View className="space-y-4 p-4">
              {[1, 2, 3].map((i) => (
                <View key={i} className="animate-pulse">
                  <View className="h-12 w-12 rounded-full bg-gray-200 mb-3" />
                  <View className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <View className="aspect-square bg-gray-200 rounded" />
                </View>
              ))}
            </View>
          ) : (
            <View>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </View>
          )
        ) : (
          <View>
            {newsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab="social" />
      <CommentsModal 
        visible={!!selectedPost} 
        post={selectedPost}
        onClose={() => setSelectedPost(null)} 
      />
    </View>
  );
}