import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Star, Clock, DollarSign, Calendar, Check, X } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Stylist, Service, TimeSlot, DiscountCode } from "@shared/schema";

interface BookingState {
  selectedServices: number[];
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  discountCode: string;
  appliedDiscount: DiscountCode | null;
  paymentMethod: string;
}

export default function BookStylist() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [booking, setBooking] = useState<BookingState>({
    selectedServices: [],
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTimeSlot: null,
    discountCode: "",
    appliedDiscount: null,
    paymentMethod: "credit_card"
  });

  const { data: stylist } = useQuery<Stylist>({
    queryKey: ["/api/stylists", id],
    queryFn: () => apiRequest("GET", `/api/stylists/${id}`).then(res => res.json()),
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services/stylist", id],
    queryFn: () => apiRequest("GET", `/api/services/stylist/${id}`).then(res => res.json()),
    enabled: !!id,
  });

  const { data: timeSlots = [] } = useQuery<TimeSlot[]>({
    queryKey: ["/api/timeslots/stylist", id, booking.selectedDate],
    queryFn: () => apiRequest("GET", `/api/timeslots/stylist/${id}?date=${booking.selectedDate}`).then(res => res.json()),
    enabled: !!id && !!booking.selectedDate,
  });

  const discountMutation = useMutation({
    mutationFn: (code: string) => 
      apiRequest("GET", `/api/discount/${code}`).then(res => res.json()),
    onSuccess: (discountCode: DiscountCode) => {
      setBooking(prev => ({ ...prev, appliedDiscount: discountCode }));
      toast({
        title: "Discount Applied",
        description: `${discountCode.discountType === 'percentage' ? discountCode.discountValue + '%' : '$' + (discountCode.discountValue / 100)} discount applied!`,
      });
    },
    onError: () => {
      setBooking(prev => ({ ...prev, appliedDiscount: null }));
      toast({
        title: "Invalid Discount Code",
        description: "Please check your discount code and try again.",
        variant: "destructive",
      });
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => 
      apiRequest("POST", "/api/bookings", bookingData).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setLocation("/bookings");
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
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
      selectedTimeSlot: null // Reset time slot when services change
    }));
  };

  const handleDateChange = (date: string) => {
    setBooking(prev => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null // Reset time slot when date changes
    }));
  };

  const handleApplyDiscount = () => {
    if (booking.discountCode.trim()) {
      discountMutation.mutate(booking.discountCode.trim().toUpperCase());
    }
  };

  const handleBooking = () => {
    if (!booking.selectedTimeSlot || booking.selectedServices.length === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select services and a time slot.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      userId: 1, // Mock user ID
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

  // Generate next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return date.toISOString().split('T')[0];
  });

  if (!stylist) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation(`/stylist/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Book {stylist.name}</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Stylist Info */}
        <Card className="m-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={stylist.avatar || ""}
                alt={stylist.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{stylist.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="font-medium">{stylist.rating}</span>
                  <span className="text-gray-600">({stylist.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-600 mt-1">{stylist.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Selection */}
        <Card className="m-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Select Services</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    booking.selectedServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={booking.selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                        <h4 className="font-medium">{service.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span className="text-sm font-medium">${(service.price / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{service.duration} min</span>
                        </div>
                        {service.category && (
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        {booking.selectedServices.length > 0 && (
          <Card className="m-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {availableDates.map((date) => {
                  const dateObj = parseISO(date);
                  const isSelected = booking.selectedDate === date;
                  const isToday = date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <button
                      key={date}
                      onClick={() => handleDateChange(date)}
                      className={`p-2 text-center rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs text-gray-500">
                        {format(dateObj, 'EEE')}
                      </div>
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                        {format(dateObj, 'd')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Slots */}
        {booking.selectedDate && booking.selectedServices.length > 0 && (
          <Card className="m-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Available Times</h3>
              {timeSlots.filter(slot => slot.isAvailable).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No available time slots for this date.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots
                    .filter(slot => slot.isAvailable)
                    .map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setBooking(prev => ({ ...prev, selectedTimeSlot: slot }))}
                        className={`p-3 text-center rounded-lg border transition-colors ${
                          booking.selectedTimeSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{slot.startTime}</div>
                        <div className="text-xs opacity-75">
                          {totalDuration} min session
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Discount Code */}
        {booking.selectedServices.length > 0 && (
          <Card className="m-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Discount Code</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter discount code"
                  value={booking.discountCode}
                  onChange={(e) => setBooking(prev => ({ ...prev, discountCode: e.target.value.toUpperCase() }))}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyDiscount}
                  disabled={!booking.discountCode.trim() || discountMutation.isPending}
                  variant="outline"
                >
                  Apply
                </Button>
              </div>
              {booking.appliedDiscount && (
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">
                    {booking.appliedDiscount.discountType === 'percentage' 
                      ? `${booking.appliedDiscount.discountValue}% discount applied`
                      : `$${(booking.appliedDiscount.discountValue / 100).toFixed(2)} discount applied`
                    }
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {booking.selectedServices.length > 0 && (
          <Card className="m-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                {selectedServicesData.map((service) => (
                  <div key={service.id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span>${(service.price / 100).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${(discountAmount / 100).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Book Now Button */}
      {booking.selectedServices.length > 0 && (
        <div className="p-4 bg-white border-t">
          <Button
            onClick={handleBooking}
            disabled={!booking.selectedTimeSlot || createBookingMutation.isPending}
            className="w-full bg-blue-600 text-white py-4 text-base font-medium"
            size="lg"
          >
            {createBookingMutation.isPending ? "Processing..." : `Book Now - $${(total / 100).toFixed(2)}`}
          </Button>
        </div>
      )}
    </div>
  );
}