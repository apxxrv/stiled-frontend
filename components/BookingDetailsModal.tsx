import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Calendar, Clock, DollarSign, MapPin, X } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';

interface BookingDetailsModalProps {
  visible: boolean;
  booking: any;
  onClose: () => void;
}

export function BookingDetailsModal({ visible, booking, onClose }: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold">Booking Details</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="space-y-4">
            {/* Stylist Info */}
            <View className="flex-row items-center space-x-3">
              <View className="h-12 w-12 rounded-full bg-gray-200" />
              <View>
                <Text className="font-medium">Stylist Name</Text>
                <Text className="text-sm text-gray-600">Location</Text>
              </View>
            </View>

            {/* Services */}
            <View>
              <Text className="font-medium mb-2">Services</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm">Service Name</Text>
                  <Text className="text-sm font-medium">${(booking.totalAmount / 100).toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Date & Time */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="font-medium mb-1">Date</Text>
                <View className="flex-row items-center space-x-2">
                  <Calendar size={16} color="#9ca3af" />
                  <Text className="text-sm">{format(parseISO(booking.date), 'MMM d, yyyy')}</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text className="font-medium mb-1">Time</Text>
                <View className="flex-row items-center space-x-2">
                  <Clock size={16} color="#9ca3af" />
                  <Text className="text-sm">{booking.startTime} - {booking.endTime}</Text>
                </View>
              </View>
            </View>

            {/* Payment Info */}
            <View>
              <Text className="font-medium mb-2">Payment</Text>
              <View className="space-y-1">
                <View className="flex-row justify-between text-sm">
                  <Text>Subtotal</Text>
                  <Text>${((booking.totalAmount + booking.discountAmount) / 100).toFixed(2)}</Text>
                </View>
                {booking.discountAmount > 0 && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-green-600">Discount ({booking.discountCode})</Text>
                    <Text className="text-sm text-green-600">-${(booking.discountAmount / 100).toFixed(2)}</Text>
                  </View>
                )}
                <View className="flex-row justify-between font-medium border-t border-gray-200 pt-1">
                  <Text>Total</Text>
                  <Text>${(booking.totalAmount / 100).toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Booking ID */}
            <View>
              <Text className="text-xs text-gray-500">
                Booking ID: #{booking.id}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}