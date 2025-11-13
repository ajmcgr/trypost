import { useState } from "react";
import { HelpCircle, RefreshCw, Filter, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import xIcon from "@/assets/x.svg";
import alexImage from "@/assets/alex-macgregor.png";

const Drafts = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [platform, setPlatform] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [account, setAccount] = useState("all");

  // Mock data - replace with actual data from database
  const draftPosts = [
    {
      id: 1,
      date: "13/11/2025",
      time: "10:41",
      type: "text",
      content: "Drafty poo",
      platform: "twitter",
      platformIcon: xIcon,
      userAvatar: alexImage,
      status: "draft",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Draft Posts</h1>
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={account} onValueChange={setAccount}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {draftPosts.length > 0 ? (
          <>
            {draftPosts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                  <span className="text-xs text-muted-foreground">text</span>
                </div>

                <p className="mb-4">{post.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img src={post.platformIcon} alt="Platform" className="w-5 h-5" />
                    </div>
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                  </div>

                  <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
                    {post.status}
                  </Badge>
                </div>
              </Card>
            ))}

            {/* Info Message */}
            <Alert className="border-muted">
              <Info className="h-4 w-4 text-muted-foreground" />
              <AlertDescription className="text-muted-foreground">
                Draft posts older than 90 days are automatically deleted to keep your workspace organized.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="flex items-center justify-center h-96 bg-muted/30 rounded-3xl">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No drafts saved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;
