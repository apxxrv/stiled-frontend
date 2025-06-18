// Mock API functions to simulate backend calls
export const mockApi = {
  getStylists: async () => {
    return [
      {
        id: 1,
        name: "Skye Kelton",
        followers: 200,
        rating: 5,
        reviewCount: 23,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        specialties: ["Luxury & High Fashion", "Minimalist & Chic"],
        services: ["Wardrobe Makeover", "Event Styling"],
        location: "New York, NY"
      },
      {
        id: 2,
        name: "Shino Itoi",
        followers: 200,
        rating: 5,
        reviewCount: 23,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        specialties: ["Streetwear", "Avant-Garde"],
        services: ["Photoshoot Styling", "Student & Budget Styling"],
        location: "Tokyo, Japan"
      },
      {
        id: 3,
        name: "Maya Chen",
        followers: 150,
        rating: 5,
        reviewCount: 45,
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
        specialties: ["Bridal", "Formal Events"],
        services: ["Wedding Styling", "Formal Events"],
        location: "Los Angeles, CA"
      },
      {
        id: 4,
        name: "Alex Rivera",
        followers: 180,
        rating: 4,
        reviewCount: 67,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        specialties: ["Business Casual", "Professional"],
        services: ["Corporate Styling", "Professional Wardrobe"],
        location: "Chicago, IL"
      }
    ];
  },

  getStylist: async (id: number) => {
    const stylists = await mockApi.getStylists();
    return stylists.find(s => s.id === id);
  },

  getPosts: async () => {
    return [
      {
        id: 1,
        stylistId: 1,
        content: "Our sleek and monochromatic stock is available to boom your winters.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
        likes: 42,
        createdAt: new Date(Date.now() - 60000)
      }
    ];
  },

  getServicesByStylist: async (stylistId: number) => {
    const allServices = [
      // Stylist 1 services
      { id: 1, stylistId: 1, name: "Complete Wardrobe Makeover", description: "Full wardrobe assessment and styling transformation", price: 50000, duration: 180, category: "Wardrobe" },
      { id: 2, stylistId: 1, name: "Personal Shopping Session", description: "Guided shopping experience with professional styling", price: 25000, duration: 120, category: "Shopping" },
      { id: 3, stylistId: 1, name: "Special Event Styling", description: "Perfect styling for weddings, galas, and special occasions", price: 35000, duration: 90, category: "Events" },
      { id: 4, stylistId: 1, name: "Virtual Style Consultation", description: "Online styling consultation and recommendations", price: 15000, duration: 60, category: "Consultation" },
      
      // Stylist 2 services
      { id: 5, stylistId: 2, name: "Streetwear Styling", description: "Modern urban and streetwear fashion guidance", price: 20000, duration: 90, category: "Streetwear" },
      { id: 6, stylistId: 2, name: "Photoshoot Styling", description: "Professional styling for photo sessions", price: 40000, duration: 120, category: "Photography" },
      { id: 7, stylistId: 2, name: "Student Discount Package", description: "Affordable styling for students and young professionals", price: 12000, duration: 75, category: "Budget" },
      { id: 8, stylistId: 2, name: "Avant-Garde Consultation", description: "Experimental and cutting-edge fashion advice", price: 30000, duration: 90, category: "Avant-Garde" },

      // Stylist 3 services
      { id: 9, stylistId: 3, name: "Bridal Styling Package", description: "Complete bridal look including dress selection and accessories", price: 75000, duration: 240, category: "Bridal" },
      { id: 10, stylistId: 3, name: "Wedding Party Styling", description: "Coordinated styling for entire wedding party", price: 45000, duration: 180, category: "Wedding" },
      { id: 11, stylistId: 3, name: "Formal Event Styling", description: "Elegant styling for formal occasions", price: 35000, duration: 120, category: "Formal" },

      // Stylist 4 services
      { id: 12, stylistId: 4, name: "Executive Wardrobe Consultation", description: "Professional wardrobe for business executives", price: 60000, duration: 150, category: "Business" },
      { id: 13, stylistId: 4, name: "Corporate Package", description: "Complete professional wardrobe makeover", price: 80000, duration: 240, category: "Corporate" },
      { id: 14, stylistId: 4, name: "Interview Styling", description: "Perfect outfit for job interviews", price: 18000, duration: 60, category: "Professional" },
    ];

    return allServices.filter(service => service.stylistId === stylistId);
  },

  getTimeSlotsByStylist: async (stylistId: number, date: string) => {
    // Generate mock time slots
    const timeSlots = ["09:00", "11:00", "14:00", "16:00"];
    return timeSlots.map((startTime, index) => ({
      id: index + 1,
      stylistId,
      date,
      startTime,
      endTime: `${parseInt(startTime.split(':')[0]) + 2}:${startTime.split(':')[1]}`,
      isAvailable: Math.random() > 0.3
    }));
  },

  getDiscountCode: async (code: string) => {
    const discountCodes = {
      'WELCOME20': { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, minAmount: 15000 },
      'FIRST50': { code: 'FIRST50', discountType: 'fixed', discountValue: 5000, minAmount: 25000 },
      'STUDENT15': { code: 'STUDENT15', discountType: 'percentage', discountValue: 15, minAmount: 10000 },
    };
    
    const discount = discountCodes[code as keyof typeof discountCodes];
    if (!discount) {
      throw new Error('Invalid discount code');
    }
    return discount;
  },

  createBooking: async (bookingData: any) => {
    return {
      id: Math.floor(Math.random() * 1000),
      ...bookingData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  getBookingsByUser: async (userId: number) => {
    return [
      {
        id: 1,
        userId: 1,
        stylistId: 1,
        serviceIds: ["1", "2"],
        date: "2025-06-20",
        startTime: "14:00",
        endTime: "17:00",
        totalAmount: 67500,
        discountCode: "WELCOME20",
        discountAmount: 17500,
        status: "confirmed",
        paymentMethod: "credit_card",
        paymentStatus: "paid",
        refundAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        stylistId: 2,
        serviceIds: ["5"],
        date: "2025-06-25",
        startTime: "10:00",
        endTime: "11:30",
        totalAmount: 20000,
        discountCode: null,
        discountAmount: 0,
        status: "pending",
        paymentMethod: "paypal",
        paymentStatus: "pending",
        refundAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 1,
        stylistId: 3,
        serviceIds: ["9"],
        date: "2025-05-15",
        startTime: "09:00",
        endTime: "13:00",
        totalAmount: 75000,
        discountCode: null,
        discountAmount: 0,
        status: "completed",
        paymentMethod: "credit_card",
        paymentStatus: "paid",
        refundAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        userId: 1,
        stylistId: 1,
        serviceIds: ["3"],
        date: "2025-05-10",
        startTime: "16:00",
        endTime: "17:30",
        totalAmount: 35000,
        discountCode: null,
        discountAmount: 0,
        status: "cancelled",
        paymentMethod: "credit_card",
        paymentStatus: "refunded",
        refundAmount: 17500,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  },

  cancelBooking: async (bookingId: number, refundAmount: number) => {
    return {
      id: bookingId,
      status: "cancelled",
      paymentStatus: refundAmount > 0 ? "refunded" : "paid",
      refundAmount,
      updatedAt: new Date()
    };
  }
};