import { 
  users, stylists, posts, comments,
  type User, type InsertUser, 
  type Stylist, type InsertStylist,
  type Post, type InsertPost,
  type Comment, type InsertComment
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stylists: Map<number, Stylist>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private currentUserId: number;
  private currentStylistId: number;
  private currentPostId: number;
  private currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.stylists = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.currentUserId = 1;
    this.currentStylistId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    
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
    
    this.stylists.set(stylist1.id, stylist1);
    this.stylists.set(stylist2.id, stylist2);
    
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
}

export const storage = new MemStorage();
