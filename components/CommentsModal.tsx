import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { ArrowLeft, Send, Smile, Heart } from 'lucide-react-native';

interface CommentsModalProps {
  visible: boolean;
  post: any;
  onClose: () => void;
}

export function CommentsModal({ visible, post, onClose }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");

  const mockUsers = [
    { id: 1, name: "Ruchi_shah", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
    { id: 2, name: "Courtney Henry", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
    { id: 3, name: "Leslie Alexander", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { id: 4, name: "Theresa Webb", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" }
  ];

  const mockComments = [
    { id: 1, content: "The stuff is amazing.", likes: 23 },
    { id: 2, content: "I really like how the beidge color is styled with white color.", likes: 23 },
    { id: 3, content: "Failures are stepping stones to success. Embrace them, learn from them, and keep moving forward", likes: 23 }
  ];

  const handleSendComment = () => {
    if (newComment.trim()) {
      setNewComment("");
    }
  };

  if (!post) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft size={20} color="#000" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold">All Comments</Text>
        </View>
        
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="space-y-4">
            {mockComments.map((comment, index) => {
              const user = mockUsers[index % mockUsers.length];
              return (
                <View key={comment.id} className="flex-row space-x-3">
                  <Image
                    source={{ uri: user.avatar }}
                    className="h-8 w-8 rounded-full"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center space-x-2">
                      <Text className="font-medium text-sm">{user.name}</Text>
                      <Text className="text-xs text-gray-500">49m</Text>
                      <View className="ml-auto flex-row items-center space-x-1">
                        <Heart size={12} color="#666" />
                        <Text className="text-xs text-gray-500">23</Text>
                      </View>
                    </View>
                    <Text className="text-sm mt-1">{comment.content}</Text>
                    <TouchableOpacity>
                      <Text className="text-xs text-gray-500 mt-1">Reply</Text>
                    </TouchableOpacity>
                    {index === 1 && (
                      <TouchableOpacity>
                        <Text className="text-xs text-gray-500 mt-1">View 20 more replies</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Reaction emojis */}
        <View className="flex-row space-x-2 px-4 py-2 border-t border-gray-200">
          <Text className="text-lg">❤️</Text>
          <Text className="text-lg">🙏</Text>
          <Text className="text-lg">😊</Text>
          <Text className="text-lg">💄</Text>
          <Text className="text-lg">😂</Text>
        </View>

        {/* Comment input */}
        <View className="flex-row items-center space-x-2 p-4 border-t border-gray-200">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" }}
            className="h-8 w-8 rounded-full"
          />
          <View className="flex-1 relative">
            <TextInput
              placeholder="Add a comment"
              value={newComment}
              onChangeText={setNewComment}
              className="pr-8 py-2 px-3 bg-gray-100 rounded-full"
            />
            <TouchableOpacity className="absolute right-2 top-2">
              <Smile size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSendComment}
            disabled={!newComment.trim()}
          >
            <Send size={16} color={newComment.trim() ? "#2563eb" : "#9ca3af"} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}