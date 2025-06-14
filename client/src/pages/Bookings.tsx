import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, DollarSign, MapPin, User, X, AlertTriangle, CheckCircle, Home, MessageCircle, Plus } from "lucide-react";
import { format, parseISO, differenceInHours } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Booking, Stylist, Service } from "@shared/schema";

interface BookingWithDetails extends Booking {
  stylist?: Stylist;
  services?: Service[];
}

function RefundPolicyDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancellation & Refund Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">24+ Hours Before</h4>
                <p className="text-sm text-gray-600">100% refund guaranteed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Within 24 Hours</h4>
                <p className="text-sm text-gray-600">50% refund available</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium">No Shows</h4>
                <p className="text-sm text-gray-600">No refund available</p>
              </div>
            </div>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Refunds are processed within 3-5 business days to your original payment method.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingDetailsDialog({ booking, children }: { booking: BookingWithDetails; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Stylist Info */}
          <div className="flex items-center gap-3">
            <img
              src={booking.stylist?.avatar || ""}
              alt={booking.stylist?.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{booking.stylist?.name}</h3>
              <p className="text-sm text-gray-600">{booking.stylist?.location}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-medium mb-2">Services</h4>
            <div className="space-y-2">
              {booking.services?.map((service) => (
                <div key={service.id} className="flex justify-between">
                  <span className="text-sm">{service.name}</span>
                  <span className="text-sm font-medium">${(service.price / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Date</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Time</h4>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="font-medium mb-2">Payment</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${((booking.totalAmount + booking.discountAmount) / 100).toFixed(2)}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({booking.discountCode})</span>
                  <span>-${(booking.discountAmount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total</span>
                <span>${(booking.totalAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Booking ID */}
          <div className="text-xs text-gray-500">
            Booking ID: #{booking.id}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingCard({ booking }: { booking: BookingWithDetails }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const calculateRefundAmount = (booking: Booking): number => {
    const bookingDateTime = parseISO(`${booking.date}T${booking.startTime}`);
    const hoursUntilBooking = differenceInHours(bookingDateTime, new Date());
    
    if (hoursUntilBooking >= 24) {
      return booking.totalAmount; // 100% refund
    } else if (hoursUntilBooking > 0) {
      return Math.floor(booking.totalAmount * 0.5); // 50% refund
    } else {
      return 0; // No refund for no-shows or past bookings
    }
  };

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) => {
      const refundAmount = calculateRefundAmount(booking);
      return apiRequest("POST", `/api/bookings/${bookingId}/cancel`, { refundAmount }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: () => {
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking.",
        variant: "destructive",
      });
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

  const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
  const refundAmount = calculateRefundAmount(booking);
  const refundPercentage = booking.totalAmount > 0 ? Math.round((refundAmount / booking.totalAmount) * 100) : 0;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={booking.stylist?.avatar || ""}
              alt={booking.stylist?.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{booking.stylist?.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{booking.stylist?.location}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-medium">${(booking.totalAmount / 100).toFixed(2)}</span>
            {booking.discountAmount > 0 && (
              <Badge variant="secondary" className="text-xs">
                -{booking.discountCode}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <BookingDetailsDialog booking={booking}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </BookingDetailsDialog>
            
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelBookingMutation.mutate(booking.id)}
                disabled={cancelBookingMutation.isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {canCancel && (
          <div className="mt-3 text-xs text-gray-500">
            Cancellation: {refundPercentage}% refund available
          </div>
        )}

        {booking.status === 'cancelled' && booking.refundAmount > 0 && (
          <div className="mt-3 text-xs text-green-600">
            Refunded: ${(booking.refundAmount / 100).toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const { data: bookings = [], isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings/user", 1], // Mock user ID
    queryFn: async () => {
      const bookingsRes = await apiRequest("GET", "/api/bookings/user/1");
      const bookingsData = await bookingsRes.json();
      
      // Fetch stylist and service details for each booking
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking: Booking) => {
          const [stylistRes, servicesRes] = await Promise.all([
            apiRequest("GET", `/api/stylists/${booking.stylistId}`),
            apiRequest("GET", `/api/services/stylist/${booking.stylistId}`)
          ]);
          
          const stylist = await stylistRes.json();
          const allServices = await servicesRes.json();
          const services = allServices.filter((service: Service) => 
            booking.serviceIds?.includes(service.id.toString())
          );
          
          return { ...booking, stylist, services };
        })
      );
      
      return enrichedBookings;
    },
  });

  const filterBookings = (bookings: BookingWithDetails[], status: 'upcoming' | 'past' | 'cancelled') => {
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">My Bookings</h1>
            <RefundPolicyDialog>
              <Button variant="ghost" size="sm">
                Refund Policy
              </Button>
            </RefundPolicyDialog>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex">
          {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              {tab}
              {filteredBookings.length > 0 && (
                <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                  {filterBookings(bookings, tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading ? (
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse mb-4">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {activeTab === 'upcoming' 
                ? "Book your first styling session to get started"
                : `You don't have any ${activeTab} bookings yet`
              }
            </p>
            {activeTab === 'upcoming' && (
              <Button onClick={() => setLocation("/home")}>
                Browse Stylists
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => setLocation("/home")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Home className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </button>
          <button 
            onClick={() => setLocation("/social")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <MessageCircle className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Social</span>
          </button>
          <button 
            onClick={() => setLocation("/new-post")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Plus className="h-5 w-5 text-gray-400" />
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span className="text-xs">Bookings</span>
          </button>
          <button 
            onClick={() => setLocation("/profile")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}