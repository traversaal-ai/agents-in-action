
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Zap } from "lucide-react";

interface LoadingDialogProps {
  open: boolean;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({ open }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md border-0 bg-white shadow-xl">
        <div className="flex flex-col items-center justify-center py-8">
          {/* Animated background circle */}
          <div className="relative mb-6">
            <div 
              className="w-20 h-20 rounded-full animate-pulse"
              style={{
                background: "linear-gradient(135deg, hsl(24 100% 58%) 0%, hsl(20 91% 48%) 100%)"
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-orange-500 animate-bounce" />
              </div>
            </div>
          </div>
          
          {/* Spinning loader */}
          <div className="mb-4">
            <Loader2 
              className="w-8 h-8 animate-spin"
              style={{ color: "hsl(24 100% 58%)" }}
            />
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generating Your LinkedIn Post
            </h3>
            <p className="text-sm text-gray-600">
              Our AI is analyzing your video and crafting the perfect post...
            </p>
          </div>
          
          {/* Progress dots */}
          <div className="flex space-x-2 mt-6">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: "hsl(24 100% 58%)",
                animationDelay: "0s"
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: "hsl(24 100% 58%)",
                animationDelay: "0.2s"
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: "hsl(24 100% 58%)",
                animationDelay: "0.4s"
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
