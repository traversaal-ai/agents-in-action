
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap } from "lucide-react";

interface SampleVideo {
  url: string;
  title: string;
  description: string;
  audience: string;
  thumbnail: string;
}

interface SampleVideosProps {
  onSelectVideo: (url: string, audience: string) => void;
}

const sampleVideos: SampleVideo[] = [
  {
    url: "https://www.youtube.com/watch?v=PduJ0P6r_8o",
    title: "Sample Video 1",
    description: "Professional development content",
    audience: "Business professionals, entrepreneurs, and career-focused individuals interested in leadership development, productivity tips, and professional growth strategies.",
    thumbnail: "https://i.ytimg.com/vi/PduJ0P6r_8o/hqdefault.jpg"
  },
  {
    url: "https://www.youtube.com/watch?v=uz_3dSU8rQo",
    title: "Sample Video 2", 
    description: "Technology and innovation insights",
    audience: "Tech enthusiasts, software developers, and innovation leaders interested in emerging technologies, digital transformation, and industry trends.",
    thumbnail: "https://i.ytimg.com/vi/uz_3dSU8rQo/hqdefault.jpg"
  },
  {
    url: "https://www.youtube.com/watch?v=_s2h7X-c2jE",
    title: "Sample Video 3",
    description: "Marketing and growth strategies",
    audience: "Marketing professionals, business owners, and growth hackers focused on digital marketing strategies, customer acquisition, and brand building techniques.",
    thumbnail: "https://i.ytimg.com/vi/_s2h7X-c2jE/hqdefault.jpg"
  }
];

export const SampleVideos = ({ onSelectVideo }: SampleVideosProps) => {
  const handlePlayOnYouTube = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleUseForPost = (url: string, audience: string) => {
    onSelectVideo(url, audience);
  };

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Try with Sample Videos</CardTitle>
        <CardDescription className="text-sm">
          Select from these example videos to see how the LinkedIn post generation works
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleVideos.map((video, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePlayOnYouTube(video.url)}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Play
                  </Button>
                  <Button
                    onClick={() => handleUseForPost(video.url, video.audience)}
                    size="sm"
                    className="flex-1 text-white h-8 text-xs"
                    style={{
                      background: "linear-gradient(135deg, hsl(24 100% 58%) 0%, hsl(20 91% 48%) 100%)"
                    }}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
