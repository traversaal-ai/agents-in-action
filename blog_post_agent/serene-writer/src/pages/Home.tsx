import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingBlog, setHasExistingBlog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's existing blog content
    const existingBlog = sessionStorage.getItem('generatedBlog');
    setHasExistingBlog(!!existingBlog);
  }, []);

  const handleViewExistingBlog = () => {
    navigate('/blog');
  };

  const handleGenerateBlog = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://n8n.srv983070.hstgr.cloud/webhook/14fddea3-5947-4780-ac74-19c9826c1d8e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog post');
      }

      const blogContent = await response.text();
      
      // Store the blog content in sessionStorage to pass to the blog page
      sessionStorage.setItem('generatedBlog', blogContent);
      
      // Navigate to blog page
      navigate('/blog');
      
    } catch (error) {
      console.error('Error generating blog:', error);
      toast({
        title: "Generation Failed",
        description: "Sorry, we couldn't generate your blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-16">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
                Create Amazing
                <span className="bg-gradient-primary bg-clip-text text-transparent block mt-2">
                  Blog Posts
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                Generate beautiful, engaging blog content with the power of AI in seconds
              </p>
              
              <div className="flex flex-col gap-4 items-center">
                <Button 
                  onClick={handleGenerateBlog}
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                >
                  Generate Blog Post
                </Button>
                
                {hasExistingBlog && (
                  <Button 
                    onClick={handleViewExistingBlog}
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    View Previous Blog
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;