
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Zap, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingDialog } from "@/components/LoadingDialog";
import { SampleVideos } from "@/components/SampleVideos";

interface WebhookResponse {
  post: string;
  videoTitle: string;
  videoThumbnail: string;
  youtubeVideoLink: string;
}

const Index = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [audienceInfo, setAudienceInfo] = useState("");
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<{id: string, thumbnail: string, title: string} | null>(null);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVideoThumbnail = (videoId: string) => {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  };

  useEffect(() => {
    if (youtubeUrl) {
      const videoId = extractVideoId(youtubeUrl);
      if (videoId) {
        setVideoPreview({
          id: videoId,
          thumbnail: getVideoThumbnail(videoId),
          title: "YouTube Video Preview"
        });
      } else {
        setVideoPreview(null);
      }
    } else {
      setVideoPreview(null);
    }
  }, [youtubeUrl]);

  const handleSampleVideoSelect = (url: string, audience: string) => {
    setYoutubeUrl(url);
    setAudienceInfo(audience);
    toast({
      title: "Sample Video Selected",
      description: "YouTube URL and audience information have been filled in",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const webhookUrl = `https://n8n.srv874091.hstgr.cloud/webhook/2d7237c9-4d90-4f07-9e0f-97deed734049?youtube=${encodeURIComponent(youtubeUrl)}&audience=${encodeURIComponent(audienceInfo)}`;
      
      console.log("Sending request to webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Webhook response:", data);
        
        setWebhookResponse(data);
        toast({
          title: "Success!",
          description: "LinkedIn post generated successfully",
        });
      } else {
        throw new Error("Webhook request failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLinkedInPost = async () => {
    if (!webhookResponse) return;
    
    const postContent = `${webhookResponse.post}

Video: ${webhookResponse.videoTitle}
Watch: ${webhookResponse.youtubeVideoLink}`;
    
    try {
      await navigator.clipboard.writeText(postContent);
      toast({
        title: "Copied!",
        description: "LinkedIn post copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setYoutubeUrl("");
    setAudienceInfo("");
    setWebhookResponse(null);
    setVideoPreview(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <LoadingDialog open={isLoading} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gray-100 mb-3">
            <svg
              fill="none"
              viewBox="0 0 134 134"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
            >
              <path
                d="M65.27 4.33L22.99 28.71L22.84 77.93L15.28 73.61V24.69L57.7 0L65.27 4.33ZM30.44 33.41V42.32L73.03 17.67L115.5 42.32V33.18L72.97 8.76L30.44 33.41ZM107.86 55.51L107.74 104.35L115.49 100.07V51L72.96 26.35L65.26 31.09L107.86 55.51ZM7.53 29.01L0.0100098 33.52V82.12L42.48 106.65L50.12 102.48L7.65002 77.91L7.53 29.01ZM92.7 104.35L50.11 128.88L57.69 133.28L99.98 108.98V59.91L92.46 55.4L92.7 104.35ZM0 91.39V99.95L42.47 124.6L84.94 100.07V91.39L42.47 115.81L0 91.39ZM33.25 51.12V65.35L38.34 67.84V55.4L45.33 51.75L63.52 62.68L69.85 59.51L45.59 44.94L33.25 51.12ZM76.13 55.79L75.88 62.45L57.27 73.13V80.2L82.25 65.96V52.16L69.73 45.9L63.55 49.5L76.13 55.79ZM45.14 58.65V86.95L56.8 94.34L68.51 86.66V79.51L56.75 87.22L51.12 83.65V62.43L45.14 58.65Z"
                fill="#FF4B2B"
              />
            </svg>
            <span className="text-xs font-medium text-orange-500">Powered by Traversaal.ai</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            YouTube to LinkedIn
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform YouTube content into professional LinkedIn posts
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!webhookResponse ? (
            <>
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    Generate LinkedIn Post
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Enter a YouTube URL and audience details to create a professional LinkedIn post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="youtube-url" className="text-sm">YouTube URL</Label>
                      <Input
                        id="youtube-url"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="h-10"
                      />
                      {videoPreview && (
                        <div className="mt-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img 
                              src={videoPreview.thumbnail} 
                              alt="Video thumbnail"
                              className="w-14 h-10 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Valid YouTube URL detected</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience-info" className="text-sm">Tell us more about your audience</Label>
                      <Textarea
                        id="audience-info"
                        placeholder="Describe your target audience, industry, interests, and any specific context you'd like to include in the post..."
                        value={audienceInfo}
                        onChange={(e) => setAudienceInfo(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                      <p className="text-xs text-gray-600">
                        💡 Help us tailor the post by describing your audience and any specific messaging you want to emphasize
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-10 text-white transition-all duration-200 text-sm"
                      style={{
                        background: "linear-gradient(135deg, hsl(24 100% 58%) 0%, hsl(20 91% 48%) 100%)"
                      }}
                      disabled={isLoading}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Generated LinkedIn Post</CardTitle>
                <CardDescription className="text-sm">
                  Your LinkedIn post has been generated successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* LinkedIn Post Design */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {/* Post Content */}
                    <div className="mb-4">
                      <div className="flex items-end justify-end mb-2">
                        <Button
                          onClick={copyLinkedInPost}
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700 h-8"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed">
                        {webhookResponse.post}
                      </div>
                    </div>

                    {/* Video Preview */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                        <img 
                          src={webhookResponse.videoThumbnail} 
                          alt={webhookResponse.videoTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-white">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {webhookResponse.videoTitle}
                        </h4>
                        <p className="text-xs text-gray-500">youtube.com</p>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {webhookResponse.post.match(/#\w+/g)?.map((hashtag, index) => (
                        <span key={index} className="text-blue-600 text-sm hover:underline cursor-pointer">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={resetForm}
                      variant="outline"
                      className="flex-1 h-10 text-sm"
                    >
                      Create Another Post
                    </Button>
                    <Button 
                      onClick={copyLinkedInPost}
                      className="flex-1 text-white h-10 text-sm"
                      style={{
                        background: "linear-gradient(135deg, hsl(24 100% 58%) 0%, hsl(20 91% 48%) 100%)"
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copy Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sample Videos Section - Now below the main content */}
          <div className="mt-6">
            <SampleVideos onSelectVideo={handleSampleVideoSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
