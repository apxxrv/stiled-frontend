import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, ArrowLeft, Send, Smile, Plus, Calendar, User, Home } from "lucide-react";
import { useLocation } from "wouter";
import type { Post, Comment, Stylist } from "@shared/schema";

// Comments Dialog Component
function CommentsDialog({ post, children }: { post: Post; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/comments/post", post.id],
    enabled: open,
  });

  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  const stylist = stylists.find(s => s.id === post.stylistId);

  // Mock user data for comments
  const mockUsers = [
    { id: 1, name: "Ruchi_shah", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
    { id: 2, name: "Courtney Henry", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
    { id: 3, name: "Leslie Alexander", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { id: 4, name: "Theresa Webb", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" }
  ];

  const handleSendComment = () => {
    if (newComment.trim()) {
      // In a real app, this would be a mutation
      setNewComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="ml-4">All Comments</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment, index) => {
            const user = mockUsers[index % mockUsers.length];
            return (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500">49m</span>
                    <Heart className="h-3 w-3 ml-auto" />
                    <span className="text-xs text-gray-500">23</span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                  <button className="text-xs text-gray-500 mt-1">Reply</button>
                  {index === 1 && (
                    <button className="text-xs text-gray-500 mt-1 block">View 20 more replies</button>
                  )}
                  {index === 3 && (
                    <button className="text-xs text-gray-500 mt-1 block">View 20 more replies</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reaction emojis */}
        <div className="flex gap-2 px-4 py-2 border-t">
          <span className="text-lg">❤️</span>
          <span className="text-lg">🙏</span>
          <span className="text-lg">😊</span>
          <span className="text-lg">💄</span>
          <span className="text-lg">😂</span>
          <span className="text-lg">😂</span>
          <span className="text-lg">😂</span>
        </div>

        {/* Comment input */}
        <div className="flex items-center gap-2 p-4 border-t">
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
            alt="You"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <Input
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="pr-8"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            variant="ghost"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// News Card Component  
function NewsCard({ news }: { news: any }) {
  return (
    <Card className="border-0 border-b border-gray-100 rounded-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=face"
              alt={news.author}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <span className="font-medium text-sm">{news.author}</span>
              <p className="text-xs text-gray-500">1 min ago</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-3">
          <h3 className="font-medium mb-2">{news.title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{news.content}</p>
          {news.hashtags && (
            <p className="text-sm text-blue-600 mt-2">{news.hashtags}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Post Card Component
function PostCard({ post }: { post: Post }) {
  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  const stylist = stylists.find(s => s.id === post.stylistId);
  const timeAgo = "1 min ago"; // In real app, calculate from createdAt

  return (
    <Card className="border-0 border-b border-gray-100 rounded-none">
      <CardContent className="p-0">
        {/* Post header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
              {stylist?.name.substring(0, 1) || "G"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">our_george</span>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  Follow
                </Button>
              </div>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post content */}
        <div className="px-4 pb-3">
          <p className="text-sm">{post.content}</p>
        </div>

        {/* Post image */}
        {post.image && (
          <div className="aspect-square">
            <img
              src={post.image}
              alt="Post content"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Post actions */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-5 w-5" />
            </Button>
            <CommentsDialog post={post}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </CommentsDialog>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>

        {/* Attribution */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-black flex items-center justify-center text-white text-xs">
              G
            </div>
            <span className="text-xs font-medium">our_george</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Social() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Feeds");

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Mock news data
  const newsItems = [
    {
      id: 1,
      author: "Etheral Fashion",
      title: "🎥New Virtual Consultation Tool📹",
      content: "We're excited to introduce Virtual Styling Consultations! Now, clients can book virtual sessions with their favorite stylists via video calls. Upgrade your profile today and start offering virtual services!",
      hashtags: "#StylistTools #VirtualStyling"
    },
    {
      id: 2,
      author: "STILED",
      title: "Great news!",
      content: "The STILED Referral Program is now live. Invite your stylist friends and earn exclusive perks for each successful signup!",
      hashtags: ""
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-3">
          <h1 className="text-center text-lg font-semibold">Social Feed</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex">
          {["Feeds", "News"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "Feeds" ? (
          isLoading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="aspect-square bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )
        ) : (
          <div>
            {newsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
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
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span className="text-xs">Social</span>
          </button>
          <button 
            onClick={() => setLocation("/new-post")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Plus className="h-5 w-5 text-gray-400" />
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <Calendar className="h-5 w-5 text-gray-400" />
          </button>
          <button 
            onClick={() => setLocation("/profile")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <User className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}