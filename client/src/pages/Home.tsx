import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Bell, Menu, Filter, Star, MessageCircle, Plus, Calendar, User } from "lucide-react";
import { useLocation } from "wouter";
import type { Stylist } from "@shared/schema";

// Filter Dialog Component
function FilterDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter by</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Location */}
          <div>
            <h3 className="mb-3 font-medium">Location</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search Location" className="pl-10" />
            </div>
          </div>

          {/* Style Preference */}
          <div>
            <h3 className="mb-3 font-medium">Style Preference</h3>
            <div className="space-y-3">
              {[
                "Luxury & High Fashion",
                "Streetwear", 
                "Minimalist & Chic",
                "Avant-Garde"
              ].map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox id={style} />
                  <label htmlFor={style} className="text-sm">{style}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Service */}
          <div>
            <h3 className="mb-3 font-medium">Service</h3>
            <div className="space-y-3">
              {[
                "Wardrobe Makeover",
                "Event Styling",
                "Photoshoot Styling", 
                "Student & Budget Styling"
              ].map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox id={service} />
                  <label htmlFor={service} className="text-sm">{service}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="mb-3 font-medium">Reviews</h3>
            <div className="h-12 bg-gray-100 rounded"></div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Stylist Card Component
function StylistCard({ stylist }: { stylist: Stylist }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={stylist.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"}
            alt={stylist.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{stylist.name}</h3>
          <p className="text-sm text-gray-600">{stylist.followers?.toLocaleString()}k Followers</p>
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-sm font-medium">{stylist.rating}</span>
            <span className="text-sm text-gray-600">({stylist.reviewCount})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: stylists = [], isLoading } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  const categories = ["All", "Clothing", "Casual", "Formal", "More"];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-medium tracking-[0.1em]">STILED</h1>
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5" />
          <Menu className="h-5 w-5" />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 pb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-10" />
          </div>
          <FilterDialog>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </FilterDialog>
        </div>
      </div>

      {/* Invite Friends Banner */}
      <div className="mx-4 mb-6 rounded-xl bg-black p-4 text-white">
        <h3 className="font-semibold">Invite friends & discover top stylists!</h3>
        <p className="text-sm opacity-90">Unlock exclusive rewards!</p>
        <Button variant="secondary" className="mt-3 text-black">
          Invite Friends
        </Button>
      </div>

      {/* Categories */}
      <div className="mb-6 px-4">
        <div className="flex gap-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap pb-2 text-sm font-medium ${
                activeCategory === category
                  ? "border-b-2 border-black text-black"
                  : "text-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Stylists */}
      <div className="flex-1 px-4">
        <h2 className="mb-4 text-lg font-semibold">Trending Stylists</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {stylists.map((stylist) => (
              <StylistCard key={stylist.id} stylist={stylist} />
            ))}
          </div>
        )}

        {/* Suggested Stylists Section */}
        <h2 className="mb-4 mt-8 text-lg font-semibold">Suggested Stylists</h2>
        <div className="grid grid-cols-2 gap-4 pb-20">
          {stylists.slice(0, 2).map((stylist) => (
            <StylistCard key={`suggested-${stylist.id}`} stylist={stylist} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span className="text-xs">Home</span>
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
          </button>
        </div>
      </div>
    </div>
  );
}