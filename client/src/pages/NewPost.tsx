import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User } from "lucide-react";
import { useLocation } from "wouter";

export default function NewPost() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Upload Post");
  const [caption, setCaption] = useState("");
  const [taggedPeople, setTaggedPeople] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Get image from URL params if coming from media selection
    const urlParams = new URLSearchParams(window.location.search);
    const imageParam = urlParams.get('image');
    if (imageParam) {
      setSelectedImage(decodeURIComponent(imageParam));
    }
  }, []);

  const handleUpload = () => {
    // In a real app, this would create a new post
    console.log("Uploading post:", { selectedImage, caption, taggedPeople });
    setLocation("/social");
  };

  const handleImageSelect = () => {
    setLocation("/upload-media");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/social")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">New Post</h1>
        <div className="w-10" />
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2">
        {["Upload Post", "Add News"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "secondary"}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Image Preview */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected for post"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              onClick={handleImageSelect}
              className="h-full w-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
            >
              Tap to select image
            </button>
          )}
        </div>

        {/* Caption */}
        <div>
          <Textarea
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[80px] border-none resize-none text-base p-0 focus-visible:ring-0"
          />
        </div>

        {/* Tag People */}
        <div className="flex items-center gap-3 py-3 border-t border-gray-100">
          <User className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tag people"
            value={taggedPeople}
            onChange={(e) => setTaggedPeople(e.target.value)}
            className="border-none p-0 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Upload Button */}
      <div className="p-4">
        <Button
          onClick={handleUpload}
          disabled={!selectedImage}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-base font-medium rounded-full"
        >
          Upload
        </Button>
      </div>
    </div>
  );
}