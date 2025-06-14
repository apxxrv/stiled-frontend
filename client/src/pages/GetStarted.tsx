import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";

export default function GetStarted() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/home");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-sm font-medium tracking-[0.2em]">STILED</h1>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold leading-tight mb-2">
              Discover, Book &<br />
              Connect.
            </h2>
          </div>

          {/* Hero image */}
          <div className="mb-8 flex justify-center">
            <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop"
                alt="Fashion models walking"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Get Started button */}
        <div className="mt-8">
          <Button
            onClick={handleGetStarted}
            className="w-full rounded-full bg-blue-600 py-4 text-base font-medium hover:bg-blue-700"
            size="lg"
          >
            <Lock className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}