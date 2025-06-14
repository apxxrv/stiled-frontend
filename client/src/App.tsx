import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Splash } from "@/pages/Splash";
import GetStarted from "@/pages/GetStarted";
import Home from "@/pages/Home";
import Social from "@/pages/Social";
import UploadMedia from "@/pages/UploadMedia";
import NewPost from "@/pages/NewPost";
import Profile from "@/pages/Profile";
import StylistDashboard from "@/pages/StylistDashboard";
import StylistProfile from "@/pages/StylistProfile";
import BookStylist from "@/pages/BookStylist";
import Bookings from "@/pages/Bookings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/home" component={Home} />
      <Route path="/social" component={Social} />
      <Route path="/upload-media" component={UploadMedia} />
      <Route path="/new-post" component={NewPost} />
      <Route path="/profile" component={Profile} />
      <Route path="/stylist-dashboard" component={StylistDashboard} />
      <Route path="/stylist/:id" component={StylistProfile} />
      <Route path="/book/:id" component={BookStylist} />
      <Route path="/bookings" component={Bookings} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
