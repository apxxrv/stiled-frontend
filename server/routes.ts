import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Stylists routes
  app.get("/api/stylists", async (req, res) => {
    try {
      const stylists = await storage.getStylists();
      res.json(stylists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stylists" });
    }
  });

  app.get("/api/stylists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stylist = await storage.getStylist(id);
      if (!stylist) {
        return res.status(404).json({ error: "Stylist not found" });
      }
      res.json(stylist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stylist" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/stylist/:stylistId", async (req, res) => {
    try {
      const stylistId = parseInt(req.params.stylistId);
      const posts = await storage.getPostsByStylist(stylistId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Comments routes
  app.get("/api/comments/post/:postId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Services routes
  app.get("/api/services/stylist/:stylistId", async (req, res) => {
    try {
      const stylistId = parseInt(req.params.stylistId);
      const services = await storage.getServicesByStylist(stylistId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Time slots routes
  app.get("/api/timeslots/stylist/:stylistId", async (req, res) => {
    try {
      const stylistId = parseInt(req.params.stylistId);
      const date = req.query.date as string;
      const timeSlots = await storage.getTimeSlotsByStylist(stylistId, date);
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time slots" });
    }
  });

  // Bookings routes
  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const booking = await storage.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, paymentStatus } = req.body;
      const booking = await storage.updateBookingStatus(id, status, paymentStatus);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.post("/api/bookings/:id/cancel", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { refundAmount } = req.body;
      const booking = await storage.cancelBooking(id, refundAmount || 0);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  // Discount codes routes
  app.get("/api/discount/:code", async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const discountCode = await storage.getDiscountCodeByCode(code);
      if (!discountCode) {
        return res.status(404).json({ error: "Discount code not found" });
      }
      
      // Check if expired
      if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
        return res.status(400).json({ error: "Discount code has expired" });
      }
      
      // Check if max uses reached
      if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
        return res.status(400).json({ error: "Discount code usage limit reached" });
      }
      
      res.json(discountCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate discount code" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
