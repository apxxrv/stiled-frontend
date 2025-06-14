import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export const Splash = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-navigate to get started after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLocation("/get-started");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Stylized S logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg
              width="80"
              height="120"
              viewBox="0 0 80 120"
              fill="none"
              className="text-black"
            >
              <path
                d="M40 20C55 20 60 30 60 40C60 50 55 55 45 55C35 55 30 60 30 70C30 80 35 85 45 85C55 85 60 75 60 65"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
        
        {/* STILED text */}
        <div className="space-y-2">
          <h1 className="text-xl font-medium tracking-[0.2em] text-black">
            STILED
          </h1>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-8">
            <div className="mx-auto h-1 w-12 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-full animate-pulse bg-black"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
