import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { Home, MessageCircle, Plus, Calendar, User } from 'lucide-react-native';

interface BottomNavigationProps {
  activeTab: 'home' | 'social' | 'bookings' | 'profile';
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home', route: '/home' },
    { id: 'social', icon: MessageCircle, label: 'Social', route: '/social' },
    { id: 'new-post', icon: Plus, label: '', route: '/new-post' },
    { id: 'bookings', icon: Calendar, label: 'Bookings', route: '/bookings' },
    { id: 'profile', icon: User, label: 'Profile', route: '/profile' },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <View className="flex-row items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => router.push(tab.route as any)}
              className="flex-col items-center py-2 px-4"
            >
              {isActive && tab.id !== 'new-post' ? (
                <View className="h-6 w-6 rounded-full bg-blue-600" />
              ) : (
                <IconComponent 
                  size={20} 
                  color={isActive ? "#2563eb" : "#9ca3af"} 
                />
              )}
              {tab.label && (
                <Text className={`text-xs mt-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}