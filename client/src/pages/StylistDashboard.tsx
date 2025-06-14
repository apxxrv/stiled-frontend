import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Users, DollarSign, TrendingUp, BarChart3, Star, MessageCircle, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export default function StylistDashboard() {
  const [, setLocation] = useLocation();

  const managementItems = [
    { icon: Edit, label: "Portfolio Showcase", subtitle: "Manage Your Work", color: "bg-pink-50 text-pink-600" },
    { icon: DollarSign, label: "Services & Pricing", subtitle: "Add Services and Set Rate", color: "bg-green-50 text-green-600" },
    { icon: BarChart3, label: "Analytics & Performance", subtitle: "Track Your Success", color: "bg-blue-50 text-blue-600" },
    { icon: Star, label: "Reviews & Ratings", subtitle: "See What Clients Say", color: "bg-yellow-50 text-yellow-600" },
    { icon: MessageCircle, label: "Social Feed", subtitle: "Control Your Posts", color: "bg-cyan-50 text-cyan-600" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Dashboard Overview</h1>
        <div className="w-10" />
      </div>

      {/* Stylist Info */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face"
              alt="Kendle Joe"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Kendle Joe</h3>
            <p className="text-sm text-gray-600">Stylist</p>
          </div>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Clients</p>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">44</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">$12.k</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manage Account */}
      <div className="px-4 pb-6">
        <h3 className="text-lg font-semibold mb-4">Manage Account</h3>
        <div className="space-y-3">
          {managementItems.map((item) => (
            <Card key={item.label} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-0">
                <button className="w-full flex items-center gap-4 p-4 text-left">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}