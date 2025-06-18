import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/get-started');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <View className="items-center">
        {/* Stylized S logo */}
        <View className="mb-8">
          <View className="relative">
            <Text className="text-6xl font-bold text-black">S</Text>
          </View>
        </View>
        
        {/* STILED text */}
        <View className="space-y-2">
          <Text className="text-xl font-medium tracking-widest text-black">
            STILED
          </Text>
        </View>

        {/* Loading indicator */}
        <View className="mt-8">
          <View className="h-1 w-12 overflow-hidden rounded-full bg-gray-200">
            <LinearGradient
              colors={['#000000', '#000000']}
              className="h-full w-full"
            />
          </View>
        </View>
      </View>
    </View>
  );
}