import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Bookmark, Calendar, Settings, Shield, Bell, ChevronRight, Home, MessageCircle, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();

  const personalItems = [
    { icon: User, label: "My Profile", href: "/profile/edit" },
    { icon: Bookmark, label: "Saved", href: "/profile/saved" },
    { icon: Calendar, label: "Past Bookings", href: "/profile/bookings" },
    { icon: Settings, label: "Style Preferences", href: "/profile/style-preferences" },
  ];

  const accountItems = [
    { icon: Settings, label: "Account Setting", href: "/profile/account" },
    { icon: Shield, label: "Privacy", href: "/profile/privacy" },
    { icon: Bell, label: "Notification Settings", href: "/profile/notifications" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* User Info Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
                  alt="Kendle Joe"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Kendle Joe</h2>
                <p className="text-white/80">kendle@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Section */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold mb-3">Personal</h3>
        <Card>
          <CardContent className="p-0">
            {personalItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setLocation(item.href)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 ${
                  index !== personalItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Account Section */}
      <div className="px-4 pb-20">
        <h3 className="text-lg font-semibold mb-3">Account</h3>
        <Card>
          <CardContent className="p-0">
            {accountItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setLocation(item.href)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 ${
                  index !== accountItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </CardContent>
        </Card>
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
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}