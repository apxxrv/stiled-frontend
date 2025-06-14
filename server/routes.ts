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

  const httpServer = createServer(app);

  return httpServer;
}
