import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/components/Header";

const Blog = () => {
  const [blogContent, setBlogContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedContent = sessionStorage.getItem('generatedBlog');
    if (storedContent) {
      setBlogContent(storedContent);
    } else {
      // If no content is found, redirect back to home
      navigate('/');
    }
  }, [navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleGenerateNew = () => {
    sessionStorage.removeItem('generatedBlog');
    navigate('/');
  };

  if (!blogContent) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <Button
            onClick={handleGenerateNew}
            className="flex items-center gap-2 w-fit bg-primary hover:bg-primary-hover"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Post
          </Button>
        </div>
        
        {/* Blog content */}
        <article className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 animate-slide-up">
          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:text-accent-foreground prose-code:bg-accent prose-pre:bg-muted">
            <ReactMarkdown>{blogContent}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Blog;