import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="get-started" />
        <Stack.Screen name="home" />
        <Stack.Screen name="social" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="stylist/[id]" />
        <Stack.Screen name="book/[id]" />
        <Stack.Screen name="bookings" />
        <Stack.Screen name="new-post" />
        <Stack.Screen name="upload-media" />
      </Stack>
    </QueryClientProvider>
  );
}