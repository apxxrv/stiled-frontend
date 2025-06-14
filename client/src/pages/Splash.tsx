import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

export const Splash = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen w-full">
      <Card className="bg-white w-full max-w-[375px] h-[812px] relative">
        <CardContent className="flex items-center justify-center h-full p-0">
          <div className="relative w-[149px]">
            <AspectRatio ratio={149 / 136}>
              <img
                className="object-contain"
                alt="Stiled"
                src="/figmaAssets/stiled--1---1--1.png"
              />
            </AspectRatio>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
