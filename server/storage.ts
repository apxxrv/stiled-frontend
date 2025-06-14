import { 
  users, stylists, posts, comments, services, timeSlots, bookings, discountCodes,
  type User, type InsertUser, 
  type Stylist, type InsertStylist,
  type Post, type InsertPost,
  type Comment, type InsertComment,
  type Service, type InsertService,
  type TimeSlot, type InsertTimeSlot,
  type Booking, type InsertBooking,
  type DiscountCode, type InsertDiscountCode
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stylist methods
  getStylists(): Promise<Stylist[]>;
  getStylist(id: number): Promise<Stylist | undefined>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  
  // Post methods
  getPosts(): Promise<Post[]>;
  getPostsByStylist(stylistId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Comment methods
  getCommentsByPost(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Service methods
  getServicesByStylist(stylistId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Time slot methods
  getTimeSlotsByStylist(stylistId: number, date?: string): Promise<TimeSlot[]>;
  getTimeSlot(id: number): Promise<TimeSlot | undefined>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  updateTimeSlotAvailability(id: number, isAvailable: boolean): Promise<TimeSlot | undefined>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBookingsByStylist(stylistId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string, paymentStatus?: string): Promise<Booking | undefined>;
  cancelBooking(id: number, refundAmount: number): Promise<Booking | undefined>;
  
  // Discount code methods
  getDiscountCodes(): Promise<DiscountCode[]>;
  getDiscountCodeByCode(code: string): Promise<DiscountCode | undefined>;
  createDiscountCode(discountCode: InsertDiscountCode): Promise<DiscountCode>;
  useDiscountCode(code: string): Promise<DiscountCode | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stylists: Map<number, Stylist>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private services: Map<number, Service>;
  private timeSlots: Map<number, TimeSlot>;
  private bookings: Map<number, Booking>;
  private discountCodes: Map<string, DiscountCode>;
  private currentUserId: number;
  private currentStylistId: number;
  private currentPostId: number;
  private currentCommentId: number;
  private currentServiceId: number;
  private currentTimeSlotId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.stylists = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.services = new Map();
    this.timeSlots = new Map();
    this.bookings = new Map();
    this.discountCodes = new Map();
    this.currentUserId = 1;
    this.currentStylistId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    this.currentServiceId = 1;
    this.currentTimeSlotId = 1;
    this.currentBookingId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed some stylists
    const stylist1: Stylist = {
      id: this.currentStylistId++,
      userId: null,
      name: "Skye Kelton",
      followers: 200000,
      rating: 5,
      reviewCount: 23,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      specialties: ["Luxury & High Fashion", "Minimalist & Chic"],
      services: ["Wardrobe Makeover", "Event Styling"],
      location: "New York, NY"
    };
    
    const stylist2: Stylist = {
      id: this.currentStylistId++,
      userId: null,
      name: "Shino Itoi",
      followers: 200000,
      rating: 5,
      reviewCount: 23,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialties: ["Streetwear", "Avant-Garde"],
      services: ["Photoshoot Styling", "Student & Budget Styling"],
      location: "Tokyo, Japan"
    };

    const stylist3: Stylist = {
      id: this.currentStylistId++,
      userId: null,
      name: "Maya Chen",
      followers: 150000,
      rating: 5,
      reviewCount: 45,
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
      specialties: ["Bridal", "Formal Events"],
      services: ["Wedding Styling", "Formal Events"],
      location: "Los Angeles, CA"
    };

    const stylist4: Stylist = {
      id: this.currentStylistId++,
      userId: null,
      name: "Alex Rivera",
      followers: 180000,
      rating: 4,
      reviewCount: 67,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialties: ["Business Casual", "Professional"],
      services: ["Corporate Styling", "Professional Wardrobe"],
      location: "Chicago, IL"
    };
    
    this.stylists.set(stylist1.id, stylist1);
    this.stylists.set(stylist2.id, stylist2);
    this.stylists.set(stylist3.id, stylist3);
    this.stylists.set(stylist4.id, stylist4);

    // Seed services for each stylist
    const servicesData = [
      // Stylist 1 services
      { stylistId: 1, name: "Complete Wardrobe Makeover", description: "Full wardrobe assessment and styling transformation", price: 50000, duration: 180, category: "Wardrobe" },
      { stylistId: 1, name: "Personal Shopping Session", description: "Guided shopping experience with professional styling", price: 25000, duration: 120, category: "Shopping" },
      { stylistId: 1, name: "Special Event Styling", description: "Perfect styling for weddings, galas, and special occasions", price: 35000, duration: 90, category: "Events" },
      { stylistId: 1, name: "Virtual Style Consultation", description: "Online styling consultation and recommendations", price: 15000, duration: 60, category: "Consultation" },
      
      // Stylist 2 services
      { stylistId: 2, name: "Streetwear Styling", description: "Modern urban and streetwear fashion guidance", price: 20000, duration: 90, category: "Streetwear" },
      { stylistId: 2, name: "Photoshoot Styling", description: "Professional styling for photo sessions", price: 40000, duration: 120, category: "Photography" },
      { stylistId: 2, name: "Student Discount Package", description: "Affordable styling for students and young professionals", price: 12000, duration: 75, category: "Budget" },
      { stylistId: 2, name: "Avant-Garde Consultation", description: "Experimental and cutting-edge fashion advice", price: 30000, duration: 90, category: "Avant-Garde" },

      // Stylist 3 services
      { stylistId: 3, name: "Bridal Styling Package", description: "Complete bridal look including dress selection and accessories", price: 75000, duration: 240, category: "Bridal" },
      { stylistId: 3, name: "Wedding Party Styling", description: "Coordinated styling for entire wedding party", price: 45000, duration: 180, category: "Wedding" },
      { stylistId: 3, name: "Formal Event Styling", description: "Elegant styling for formal occasions", price: 35000, duration: 120, category: "Formal" },

      // Stylist 4 services
      { stylistId: 4, name: "Executive Wardrobe Consultation", description: "Professional wardrobe for business executives", price: 60000, duration: 150, category: "Business" },
      { stylistId: 4, name: "Corporate Package", description: "Complete professional wardrobe makeover", price: 80000, duration: 240, category: "Corporate" },
      { stylistId: 4, name: "Interview Styling", description: "Perfect outfit for job interviews", price: 18000, duration: 60, category: "Professional" },
    ];

    servicesData.forEach(service => {
      const newService: Service = {
        id: this.currentServiceId++,
        stylistId: service.stylistId,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category
      };
      this.services.set(newService.id, newService);
    });

    // Generate time slots for the next 30 days
    const today = new Date();
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateString = date.toISOString().split('T')[0];

      // Skip weekends for some stylists
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      [1, 2, 3, 4].forEach(stylistId => {
        // Different availability patterns for each stylist
        const timeSlots = stylistId === 1 || stylistId === 3 ? 
          ["09:00", "11:00", "14:00", "16:00"] : // Full service stylists
          isWeekend ? [] : ["10:00", "13:00", "15:00", "17:00"]; // Weekday only stylists

        timeSlots.forEach(startTime => {
          const [hours, minutes] = startTime.split(':').map(Number);
          const endDate = new Date(date);
          endDate.setHours(hours + 2, minutes); // 2 hour slots
          const endTime = endDate.toTimeString().substring(0, 5);

          const timeSlot: TimeSlot = {
            id: this.currentTimeSlotId++,
            stylistId,
            date: dateString,
            startTime,
            endTime,
            isAvailable: Math.random() > 0.3 // 70% availability
          };
          this.timeSlots.set(timeSlot.id, timeSlot);
        });
      });
    }

    // Seed discount codes
    const discountCodesData = [
      { code: "WELCOME20", discountType: "percentage", discountValue: 20, minAmount: 15000, maxUses: 100, usedCount: 15, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: "FIRST50", discountType: "fixed", discountValue: 5000, minAmount: 25000, maxUses: 50, usedCount: 23, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true },
      { code: "STUDENT15", discountType: "percentage", discountValue: 15, minAmount: 10000, maxUses: null, usedCount: 45, expiresAt: null, isActive: true },
      { code: "HOLIDAY30", discountType: "percentage", discountValue: 30, minAmount: 30000, maxUses: 25, usedCount: 8, expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), isActive: true },
    ];

    discountCodesData.forEach(code => {
      const discountCode: DiscountCode = {
        id: 1,
        code: code.code,
        discountType: code.discountType,
        discountValue: code.discountValue,
        minAmount: code.minAmount,
        maxUses: code.maxUses,
        usedCount: code.usedCount,
        expiresAt: code.expiresAt,
        isActive: code.isActive
      };
      this.discountCodes.set(code.code, discountCode);
    });

    // Seed sample bookings
    const bookingsData = [
      {
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
        refundAmount: 0
      },
      {
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
        refundAmount: 0
      },
      {
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
        refundAmount: 0
      },
      {
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
        refundAmount: 17500
      }
    ];

    bookingsData.forEach(booking => {
      const newBooking: Booking = {
        id: this.currentBookingId++,
        userId: booking.userId,
        stylistId: booking.stylistId,
        serviceIds: booking.serviceIds,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalAmount: booking.totalAmount,
        discountCode: booking.discountCode,
        discountAmount: booking.discountAmount,
        status: booking.status,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        refundAmount: booking.refundAmount,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      this.bookings.set(newBooking.id, newBooking);
    });
    
    // Seed a post
    const post1: Post = {
      id: this.currentPostId++,
      stylistId: stylist1.id,
      content: "Our sleek and monochromatic stock is available to boom your winters.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      likes: 42,
      createdAt: new Date(Date.now() - 60000) // 1 min ago
    };
    
    this.posts.set(post1.id, post1);
    
    // Seed some comments
    const comments = [
      {
        id: this.currentCommentId++,
        postId: post1.id,
        userId: 1,
        content: "The stuff is amazing.",
        likes: 23,
        createdAt: new Date(Date.now() - 49 * 60000)
      },
      {
        id: this.currentCommentId++,
        postId: post1.id,
        userId: 2,
        content: "I really like how the beidge color is styled with white color.",
        likes: 23,
        createdAt: new Date(Date.now() - 49 * 60000)
      },
      {
        id: this.currentCommentId++,
        postId: post1.id,
        userId: 3,
        content: "Failures are stepping stones to success. Embrace them, learn from them, and keep moving forward",
        likes: 23,
        createdAt: new Date(Date.now() - 49 * 60000)
      }
    ];
    
    comments.forEach(comment => this.comments.set(comment.id, comment));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isStyler: false,
      avatar: null,
      bio: null,
      location: null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Stylist methods
  async getStylists(): Promise<Stylist[]> {
    return Array.from(this.stylists.values());
  }
  
  async getStylist(id: number): Promise<Stylist | undefined> {
    return this.stylists.get(id);
  }
  
  async createStylist(insertStylist: InsertStylist): Promise<Stylist> {
    const id = this.currentStylistId++;
    const stylist: Stylist = { 
      id,
      userId: insertStylist.userId ?? null,
      name: insertStylist.name,
      followers: insertStylist.followers || 0,
      rating: insertStylist.rating || 5,
      reviewCount: insertStylist.reviewCount || 0,
      avatar: insertStylist.avatar || null,
      specialties: insertStylist.specialties || null,
      services: insertStylist.services || null,
      location: insertStylist.location || null
    };
    this.stylists.set(id, stylist);
    return stylist;
  }
  
  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
  
  async getPostsByStylist(stylistId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.stylistId === stylistId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { 
      id,
      stylistId: insertPost.stylistId || null,
      content: insertPost.content,
      image: insertPost.image || null,
      likes: insertPost.likes || 0,
      createdAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }
  
  // Comment methods
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = { 
      id,
      postId: insertComment.postId || null,
      userId: insertComment.userId || null,
      content: insertComment.content,
      likes: insertComment.likes || 0,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Service methods
  async getServicesByStylist(stylistId: number): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(service => service.stylistId === stylistId);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { 
      id,
      stylistId: insertService.stylistId || null,
      name: insertService.name,
      description: insertService.description || null,
      price: insertService.price,
      duration: insertService.duration,
      category: insertService.category || null
    };
    this.services.set(id, service);
    return service;
  }

  // Time slot methods
  async getTimeSlotsByStylist(stylistId: number, date?: string): Promise<TimeSlot[]> {
    let slots = Array.from(this.timeSlots.values())
      .filter(slot => slot.stylistId === stylistId);
    
    if (date) {
      slots = slots.filter(slot => slot.date === date);
    }
    
    return slots.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async getTimeSlot(id: number): Promise<TimeSlot | undefined> {
    return this.timeSlots.get(id);
  }

  async createTimeSlot(insertTimeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const id = this.currentTimeSlotId++;
    const timeSlot: TimeSlot = { 
      id,
      stylistId: insertTimeSlot.stylistId || null,
      date: insertTimeSlot.date,
      startTime: insertTimeSlot.startTime,
      endTime: insertTimeSlot.endTime,
      isAvailable: insertTimeSlot.isAvailable !== false
    };
    this.timeSlots.set(id, timeSlot);
    return timeSlot;
  }

  async updateTimeSlotAvailability(id: number, isAvailable: boolean): Promise<TimeSlot | undefined> {
    const timeSlot = this.timeSlots.get(id);
    if (timeSlot) {
      timeSlot.isAvailable = isAvailable;
      this.timeSlots.set(id, timeSlot);
    }
    return timeSlot;
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBookingsByStylist(stylistId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.stylistId === stylistId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      id,
      userId: insertBooking.userId || null,
      stylistId: insertBooking.stylistId || null,
      serviceIds: insertBooking.serviceIds || null,
      date: insertBooking.date,
      startTime: insertBooking.startTime,
      endTime: insertBooking.endTime,
      totalAmount: insertBooking.totalAmount,
      discountCode: insertBooking.discountCode || null,
      discountAmount: insertBooking.discountAmount || 0,
      status: insertBooking.status,
      paymentMethod: insertBooking.paymentMethod || null,
      paymentStatus: insertBooking.paymentStatus,
      refundAmount: insertBooking.refundAmount || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string, paymentStatus?: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      if (paymentStatus) {
        booking.paymentStatus = paymentStatus;
      }
      booking.updatedAt = new Date();
      this.bookings.set(id, booking);
    }
    return booking;
  }

  async cancelBooking(id: number, refundAmount: number): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = "cancelled";
      booking.paymentStatus = refundAmount > 0 ? "refunded" : booking.paymentStatus;
      booking.refundAmount = refundAmount;
      booking.updatedAt = new Date();
      this.bookings.set(id, booking);
    }
    return booking;
  }

  // Discount code methods
  async getDiscountCodes(): Promise<DiscountCode[]> {
    return Array.from(this.discountCodes.values());
  }

  async getDiscountCodeByCode(code: string): Promise<DiscountCode | undefined> {
    return this.discountCodes.get(code);
  }

  async createDiscountCode(insertDiscountCode: InsertDiscountCode): Promise<DiscountCode> {
    const discountCode: DiscountCode = { 
      id: 1,
      code: insertDiscountCode.code,
      discountType: insertDiscountCode.discountType,
      discountValue: insertDiscountCode.discountValue,
      minAmount: insertDiscountCode.minAmount || 0,
      maxUses: insertDiscountCode.maxUses || null,
      usedCount: insertDiscountCode.usedCount || 0,
      expiresAt: insertDiscountCode.expiresAt || null,
      isActive: insertDiscountCode.isActive !== false
    };
    this.discountCodes.set(discountCode.code, discountCode);
    return discountCode;
  }

  async useDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const discountCode = this.discountCodes.get(code);
    if (discountCode && discountCode.isActive) {
      // Check if expired
      if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
        return undefined;
      }
      
      // Check if max uses reached
      if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
        return undefined;
      }
      
      discountCode.usedCount += 1;
      this.discountCodes.set(code, discountCode);
      return discountCode;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
