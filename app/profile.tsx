import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bookmark, Calendar, Settings, Shield, Bell, ChevronRight } from 'lucide-react-native';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function Profile() {
  const personalItems = [
    { icon: User, label: "My Profile", href: "/profile/edit" },
    { icon: Bookmark, label: "Saved", href: "/profile/saved" },
    { icon: Calendar, label: "Past Bookings", href: "/profile/bookings" },
    { icon: Settings, label: "Style Preferences", href: "/profile/style-preferences" },
  ];

  const accountItems = [
    { icon: Settings, label: "Account Setting", href: "/profile/account" },
    { icon: Shield, label: "Privacy", href: "/profile/privacy" },
    { icon: Bell, label: "Notification Settings", href: "/profile/notifications" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View className="p-4 pt-12">
          <LinearGradient
            colors={['#2563eb', '#7c3aed']}
            className="rounded-xl p-6"
          >
            <View className="flex-row items-center space-x-4">
              <View className="h-16 w-16 rounded-full bg-white/20 items-center justify-center overflow-hidden">
                <Text className="text-white text-xl font-semibold">KJ</Text>
              </View>
              <View>
                <Text className="text-xl font-semibold text-white">Kendle Joe</Text>
                <Text className="text-white/80">kendle@gmail.com</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Personal Section */}
        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold mb-3">Personal</Text>
          <View className="bg-white rounded-lg overflow-hidden">
            {personalItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.href as any)}
                className={`flex-row items-center justify-between p-4 ${
                  index !== personalItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-row items-center space-x-3">
                  <item.icon size={20} color="#9ca3af" />
                  <Text className="font-medium">{item.label}</Text>
                </View>
                <ChevronRight size={16} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold mb-3">Account</Text>
          <View className="bg-white rounded-lg overflow-hidden">
            {accountItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.href as any)}
                className={`flex-row items-center justify-between p-4 ${
                  index !== accountItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-row items-center space-x-3">
                  <item.icon size={20} color="#9ca3af" />
                  <Text className="font-medium">{item.label}</Text>
                </View>
                <ChevronRight size={16} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" />
    </View>
  );
}