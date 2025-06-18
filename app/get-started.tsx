import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';

export default function GetStarted() {
  const handleGetStarted = () => {
    router.replace('/home');
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pt-12">
        <Text className="text-sm font-medium tracking-widest text-white">STILED</Text>
      </View>

      {/* Main content */}
      <View className="flex-1 justify-between p-4">
        <View className="flex-1 justify-center">
          <View className="mb-8">
            <Text className="text-3xl font-bold leading-tight text-white mb-2">
              Discover, Book &{'\n'}
              Connect.
            </Text>
          </View>

          {/* Hero image */}
          <View className="mb-8 items-center">
            <View className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop" }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Get Started button */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={handleGetStarted}
            className="w-full rounded-full bg-blue-600 py-4 flex-row items-center justify-center"
          >
            <Lock size={16} color="white" />
            <Text className="ml-2 text-base font-medium text-white">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}