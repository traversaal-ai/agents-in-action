import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

interface FinanceResponse {
  analysis: string;
  timestamp: string;
}

const FinanceAssistant = () => {
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FinanceResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !query.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both username and query fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://n8n.srv983070.hstgr.cloud/webhook/d82c3854-146b-4212-b94e-5b0ca8d7075b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          query: query.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      
      setResponse({
        analysis: data || "Analysis completed successfully.",
        timestamp: new Date().toLocaleString(),
      });

      toast({
        title: "Analysis Complete",
        description: "Your financial analysis has been generated.",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get financial analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Finance AI Assistant</h1>
              <p className="text-muted-foreground">Get intelligent financial analysis and insights</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="shadow-medium animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Financial Query</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query" className="text-sm font-medium">
                    Financial Question
                  </Label>
                  <Textarea
                    id="query"
                    placeholder="e.g., Analyze my stock portfolio performance over the last quarter, or Compare different mutual fund options for retirement planning..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={5}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="finance"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Get Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Response Display */}
          <Card className="shadow-medium animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <DollarSign className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse-gentle" />
                  </div>
                  <p className="text-muted-foreground text-center">
                    Processing your financial query...
                  </p>
                </div>
              ) : response ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg border-l-4 border-success">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {response.analysis}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Analysis completed</span>
                    <span>{response.timestamp}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <div className="bg-muted/50 p-4 rounded-full">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Submit your financial question to get started
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Our AI will provide detailed analysis and insights
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FinanceAssistant;