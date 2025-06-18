import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Star, Clock, DollarSign, Calendar, Check } from 'lucide-react-native';
import { format, addDays, parseISO } from 'date-fns';
import { mockApi } from '@/lib/mockApi';

export default function BookStylist() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [booking, setBooking] = useState({
    selectedServices: [] as number[],
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTimeSlot: null as any,
    discountCode: "",
    appliedDiscount: null as any,
    paymentMethod: "credit_card"
  });

  const { data: stylist } = useQuery({
    queryKey: ['stylist', id],
    queryFn: () => mockApi.getStylist(parseInt(id!)),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', id],
    queryFn: () => mockApi.getServicesByStylist(parseInt(id!)),
    enabled: !!id,
  });

  const { data: timeSlots = [] } = useQuery({
    queryKey: ['timeslots', id, booking.selectedDate],
    queryFn: () => mockApi.getTimeSlotsByStylist(parseInt(id!), booking.selectedDate),
    enabled: !!id && !!booking.selectedDate,
  });

  const discountMutation = useMutation({
    mutationFn: (code: string) => mockApi.getDiscountCode(code),
    onSuccess: (discountCode) => {
      setBooking(prev => ({ ...prev, appliedDiscount: discountCode }));
      Alert.alert("Discount Applied", `${discountCode.discountType === 'percentage' ? discountCode.discountValue + '%' : '$' + (discountCode.discountValue / 100)} discount applied!`);
    },
    onError: () => {
      setBooking(prev => ({ ...prev, appliedDiscount: null }));
      Alert.alert("Invalid Discount Code", "Please check your discount code and try again.");
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => mockApi.createBooking(bookingData),
    onSuccess: () => {
      Alert.alert("Booking Confirmed!", "Your booking has been successfully created.");
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      router.push('/bookings');
    },
    onError: () => {
      Alert.alert("Booking Failed", "There was an error creating your booking. Please try again.");
    },
  });

  const selectedServicesData = services.filter(service => 
    booking.selectedServices.includes(service.id)
  );

  const subtotal = selectedServicesData.reduce((sum, service) => sum + service.price, 0);
  const discountAmount = booking.appliedDiscount 
    ? booking.appliedDiscount.discountType === 'percentage'
      ? Math.floor(subtotal * booking.appliedDiscount.discountValue / 100)
      : booking.appliedDiscount.discountValue
    : 0;
  const total = subtotal - discountAmount;

  const totalDuration = selectedServicesData.reduce((sum, service) => sum + service.duration, 0);

  const handleServiceToggle = (serviceId: number) => {
    setBooking(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
      selectedTimeSlot: null
    }));
  };

  const handleDateChange = (date: string) => {
    setBooking(prev => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null
    }));
  };

  const handleApplyDiscount = () => {
    if (booking.discountCode.trim()) {
      discountMutation.mutate(booking.discountCode.trim().toUpperCase());
    }
  };

  const handleBooking = () => {
    if (!booking.selectedTimeSlot || booking.selectedServices.length === 0) {
      Alert.alert("Incomplete Booking", "Please select services and a time slot.");
      return;
    }

    const bookingData = {
      userId: 1,
      stylistId: parseInt(id!),
      serviceIds: booking.selectedServices.map(String),
      date: booking.selectedDate,
      startTime: booking.selectedTimeSlot.startTime,
      endTime: booking.selectedTimeSlot.endTime,
      totalAmount: total,
      discountCode: booking.appliedDiscount?.code || null,
      discountAmount: discountAmount,
      status: "pending",
      paymentMethod: booking.paymentMethod,
      paymentStatus: "pending"
    };

    createBookingMutation.mutate(bookingData);
  };

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return date.toISOString().split('T')[0];
  });

  if (!stylist) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pt-12 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Book {stylist.name}</Text>
        <View className="w-5" />
      </View>

      <ScrollView className="flex-1 pb-6" showsVerticalScrollIndicator={false}>
        {/* Stylist Info */}
        <View className="m-4 bg-white rounded-lg p-4">
          <View className="flex-row items-center space-x-4">
            <View className="h-16 w-16 rounded-full bg-gray-200" />
            <View className="flex-1">
              <Text className="text-xl font-semibold">{stylist.name}</Text>
              <View className="flex-row items-center space-x-2 mt-1">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="font-medium">{stylist.rating}</Text>
                <Text className="text-gray-600">({stylist.reviewCount} reviews)</Text>
              </View>
              <Text className="text-gray-600 mt-1">{stylist.location}</Text>
            </View>
          </View>
        </View>

        {/* Services Selection */}
        <View className="m-4 bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold mb-4">Select Services</Text>
          <View className="space-y-3">
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => handleServiceToggle(service.id)}
                className={`p-4 border rounded-lg ${
                  booking.selectedServices.includes(service.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center space-x-2">
                      <View className={`h-4 w-4 rounded border ${
                        booking.selectedServices.includes(service.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      } items-center justify-center`}>
                        {booking.selectedServices.includes(service.id) && (
                          <Check size={12} color="white" />
                        )}
                      </View>
                      <Text className="font-medium">{service.name}</Text>
                    </View>
                    <Text className="text-sm text-gray-600 mt-1">{service.description}</Text>
                    <View className="flex-row items-center space-x-4 mt-2">
                      <View className="flex-row items-center">
                        <DollarSign size={12} color="#9ca3af" />
                        <Text className="text-sm font-medium">${(service.price / 100).toFixed(2)}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Clock size={12} color="#9ca3af" />
                        <Text className="text-sm">{service.duration} min</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        {booking.selectedServices.length > 0 && (
          <View className="m-4 bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold mb-4">Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                {availableDates.map((date) => {
                  const dateObj = parseISO(date);
                  const isSelected = booking.selectedDate === date;
                  const isToday = date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <TouchableOpacity
                      key={date}
                      onPress={() => handleDateChange(date)}
                      className={`p-2 rounded-lg border min-w-[60px] items-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <Text className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                        {format(dateObj, 'EEE')}
                      </Text>
                      <Text className={`text-sm font-medium ${
                        isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-black'
                      }`}>
                        {format(dateObj, 'd')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Time Slots */}
        {booking.selectedDate && booking.selectedServices.length > 0 && (
          <View className="m-4 bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold mb-4">Available Times</Text>
            {timeSlots.filter(slot => slot.isAvailable).length === 0 ? (
              <Text className="text-gray-500 text-center py-4">No available time slots for this date.</Text>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {timeSlots
                  .filter(slot => slot.isAvailable)
                  .map((slot) => (
                    <TouchableOpacity
                      key={slot.id}
                      onPress={() => setBooking(prev => ({ ...prev, selectedTimeSlot: slot }))}
                      className={`w-[48%] p-3 rounded-lg border mb-3 ${
                        booking.selectedTimeSlot?.id === slot.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <Text className={`font-medium text-center ${
                        booking.selectedTimeSlot?.id === slot.id ? 'text-white' : 'text-black'
                      }`}>
                        {slot.startTime}
                      </Text>
                      <Text className={`text-xs text-center ${
                        booking.selectedTimeSlot?.id === slot.id ? 'text-white opacity-75' : 'text-gray-500'
                      }`}>
                        {totalDuration} min session
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        )}

        {/* Discount Code */}
        {booking.selectedServices.length > 0 && (
          <View className="m-4 bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold mb-4">Discount Code</Text>
            <View className="flex-row space-x-2">
              <TextInput
                placeholder="Enter discount code"
                value={booking.discountCode}
                onChangeText={(text) => setBooking(prev => ({ ...prev, discountCode: text.toUpperCase() }))}
                className="flex-1 p-3 border border-gray-300 rounded-md"
              />
              <TouchableOpacity
                onPress={handleApplyDiscount}
                disabled={!booking.discountCode.trim() || discountMutation.isPending}
                className="px-4 py-3 border border-gray-300 rounded-md"
              >
                <Text>Apply</Text>
              </TouchableOpacity>
            </View>
            {booking.appliedDiscount && (
              <View className="flex-row items-center space-x-2 mt-2">
                <Check size={16} color="#10b981" />
                <Text className="text-sm text-green-600">
                  {booking.appliedDiscount.discountType === 'percentage' 
                    ? `${booking.appliedDiscount.discountValue}% discount applied`
                    : `$${(booking.appliedDiscount.discountValue / 100).toFixed(2)} discount applied`
                  }
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Order Summary */}
        {booking.selectedServices.length > 0 && (
          <View className="m-4 bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold mb-4">Order Summary</Text>
            <View className="space-y-2">
              {selectedServicesData.map((service) => (
                <View key={service.id} className="flex-row justify-between">
                  <Text>{service.name}</Text>
                  <Text>${(service.price / 100).toFixed(2)}</Text>
                </View>
              ))}
              <View className="border-t border-gray-200 pt-2">
                <View className="flex-row justify-between">
                  <Text>Subtotal</Text>
                  <Text>${(subtotal / 100).toFixed(2)}</Text>
                </View>
                {discountAmount > 0 && (
                  <View className="flex-row justify-between">
                    <Text className="text-green-600">Discount</Text>
                    <Text className="text-green-600">-${(discountAmount / 100).toFixed(2)}</Text>
                  </View>
                )}
                <View className="border-t border-gray-200 pt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold">Total</Text>
                    <Text className="text-lg font-semibold">${(total / 100).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Now Button */}
      {booking.selectedServices.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            onPress={handleBooking}
            disabled={!booking.selectedTimeSlot || createBookingMutation.isPending}
            className={`w-full py-4 rounded-lg ${
              !booking.selectedTimeSlot || createBookingMutation.isPending
                ? 'bg-gray-300'
                : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-center text-base font-medium">
              {createBookingMutation.isPending ? "Processing..." : `Book Now - $${(total / 100).toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}