import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Star, ExternalLink, Calendar, Home, MessageCircle, Plus, User } from "lucide-react";
import { useLocation } from "wouter";
import type { Stylist } from "@shared/schema";

export default function StylistProfile() {
  const [, setLocation] = useLocation();
  
  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  // For demo, using first stylist
  const stylist = stylists[0];

  const portfolioImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop", 
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  ];

  if (!stylist) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header with background image */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-purple-900 to-pink-800 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=300&fit=crop"
            alt="Cover"
            className="h-full w-full object-cover opacity-70"
          />
        </div>
        
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/home")}
          className="absolute top-4 left-4 bg-black/20 text-white hover:bg-black/30"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Profile picture and actions */}
        <div className="absolute -bottom-8 left-4 flex items-end gap-4">
          <div className="h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-white">
            <img
              src={stylist.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"}
              alt={stylist.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" className="bg-white">
              <Mail className="h-4 w-4 mr-2" />
            </Button>
            <Button className="bg-blue-600 text-white px-6">
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-12 px-4 pb-4">
        <h1 className="text-2xl font-bold">{stylist.name}</h1>
        
        {/* Stats */}
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span className="font-medium">{stylist.rating}</span>
            <span className="text-gray-600">({stylist.reviewCount})</span>
          </div>
          <div>
            <span className="font-medium">500</span>
            <span className="text-gray-600 ml-1">Posts</span>
          </div>
          <div>
            <span className="font-medium">1.2M</span>
            <span className="text-gray-600 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-medium">1K</span>
            <span className="text-gray-600 ml-1">Following</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 text-sm leading-relaxed">
          <p>💒 Your Bridal Beauty Destination 💍🌸 Makeup | Styling | Bridal Prep Experts | ✨ Transforming brides with elegance ✨ New York</p>
          <p className="text-gray-600 mt-1">📍 DM for bookings & inquiries</p>
          <a href="#" className="text-blue-600 flex items-center gap-1 mt-1">
            www.allbrides.com
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Portfolio/Tagged Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button className="flex-1 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 flex items-center justify-center gap-2">
            <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
            Portfolio
          </button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            Tagged
          </button>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="flex-1 p-1 pb-20">
        <div className="grid grid-cols-3 gap-1">
          {portfolioImages.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden">
              <img
                src={image}
                alt={`Portfolio ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
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
            <Calendar className="h-5 w-5 text-gray-400" />
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