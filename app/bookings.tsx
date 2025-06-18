import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, DollarSign, MapPin, User, AlertTriangle, CheckCircle, X } from 'lucide-react-native';
import { format, parseISO, differenceInHours } from 'date-fns';
import { BottomNavigation } from '@/components/BottomNavigation';
import { RefundPolicyModal } from '@/components/RefundPolicyModal';
import { BookingDetailsModal } from '@/components/BookingDetailsModal';
import { mockApi } from '@/lib/mockApi';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 1],
    queryFn: () => mockApi.getBookingsByUser(1),
  });

  const calculateRefundAmount = (booking: any): number => {
    const bookingDateTime = parseISO(`${booking.date}T${booking.startTime}`);
    const hoursUntilBooking = differenceInHours(bookingDateTime, new Date());
    
    if (hoursUntilBooking >= 24) {
      return booking.totalAmount;
    } else if (hoursUntilBooking > 0) {
      return Math.floor(booking.totalAmount * 0.5);
    } else {
      return 0;
    }
  };

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) => {
      const booking = bookings.find(b => b.id === bookingId);
      const refundAmount = calculateRefundAmount(booking);
      return mockApi.cancelBooking(bookingId, refundAmount);
    },
    onSuccess: () => {
      Alert.alert("Booking Cancelled", "Your booking has been cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => {
      Alert.alert("Cancellation Failed", "There was an error cancelling your booking.");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
    const refundAmount = calculateRefundAmount(booking);
    const refundPercentage = booking.totalAmount > 0 ? Math.round((refundAmount / booking.totalAmount) * 100) : 0;

    return (
      <View className="mb-4 bg-white rounded-lg p-4 shadow-sm">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center space-x-3">
            <View className="h-10 w-10 rounded-full bg-gray-200" />
            <View>
              <Text className="font-medium">Stylist Name</Text>
              <View className="flex-row items-center">
                <MapPin size={12} color="#9ca3af" />
                <Text className="text-sm text-gray-600 ml-1">Location</Text>
              </View>
            </View>
          </View>
          <View className={`px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
            <Text className="text-xs font-medium capitalize">{booking.status}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <Calendar size={16} color="#9ca3af" />
            <Text className="text-sm ml-2">{format(parseISO(booking.date), 'MMM d, yyyy')}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#9ca3af" />
            <Text className="text-sm ml-2">{booking.startTime} - {booking.endTime}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <DollarSign size={16} color="#9ca3af" />
            <Text className="font-medium ml-1">${(booking.totalAmount / 100).toFixed(2)}</Text>
            {booking.discountAmount > 0 && (
              <View className="ml-2 px-2 py-1 bg-gray-100 rounded">
                <Text className="text-xs">-{booking.discountCode}</Text>
              </View>
            )}
          </View>
          
          <View className="flex-row space-x-2">
            <TouchableOpacity 
              onPress={() => setSelectedBooking(booking)}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              <Text className="text-sm">Details</Text>
            </TouchableOpacity>
            
            {canCancel && (
              <TouchableOpacity
                onPress={() => cancelBookingMutation.mutate(booking.id)}
                disabled={cancelBookingMutation.isPending}
                className="px-3 py-1 bg-red-500 rounded"
              >
                <Text className="text-sm text-white">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {canCancel && (
          <Text className="mt-3 text-xs text-gray-500">
            Cancellation: {refundPercentage}% refund available
          </Text>
        )}

        {booking.status === 'cancelled' && booking.refundAmount > 0 && (
          <Text className="mt-3 text-xs text-green-600">
            Refunded: ${(booking.refundAmount / 100).toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const filterBookings = (bookings: any[], status: 'upcoming' | 'past' | 'cancelled') => {
    const now = new Date();
    
    switch (status) {
      case 'upcoming':
        return bookings.filter(booking => {
          const bookingDate = parseISO(booking.date);
          return (booking.status === 'confirmed' || booking.status === 'pending') && bookingDate >= now;
        });
      case 'past':
        return bookings.filter(booking => {
          const bookingDate = parseISO(booking.date);
          return booking.status === 'completed' || (bookingDate < now && booking.status !== 'cancelled');
        });
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings(bookings, activeTab);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12">
        <View className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">My Bookings</Text>
            <TouchableOpacity onPress={() => setShowRefundPolicy(true)}>
              <Text className="text-sm text-gray-600">Refund Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tabs */}
        <View className="flex-row">
          {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3 ${
                activeTab === tab ? 'border-b-2 border-blue-600' : ''
              }`}
            >
              <Text className={`text-center text-sm font-medium capitalize ${
                activeTab === tab ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {tab}
                {filteredBookings.length > 0 && (
                  <Text className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                    {filterBookings(bookings, tab).length}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="p-4">
            {[1, 2, 3].map((i) => (
              <View key={i} className="h-24 bg-gray-200 rounded-lg mb-4" />
            ))}
          </View>
        ) : filteredBookings.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12 px-4">
            <Calendar size={48} color="#9ca3af" />
            <Text className="text-lg font-medium text-gray-900 mb-2 mt-4">
              No {activeTab} bookings
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              {activeTab === 'upcoming' 
                ? "Book your first styling session to get started"
                : `You don't have any ${activeTab} bookings yet`
              }
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity 
                onPress={() => router.push('/home')}
                className="bg-blue-600 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Browse Stylists</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="p-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab="bookings" />
      <RefundPolicyModal visible={showRefundPolicy} onClose={() => setShowRefundPolicy(false)} />
      <BookingDetailsModal 
        visible={!!selectedBooking} 
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)} 
      />
    </View>
  );
}