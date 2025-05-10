
import React from "react";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, index, onRemove }) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(index);
  };
  
  return (
    <div 
      key={index} 
      className="relative rounded-md overflow-hidden border border-border h-24"
      onClick={e => e.stopPropagation()}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
        <Image className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="absolute top-0 right-0 p-1">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-5 w-5 rounded-full"
          onClick={handleRemoveClick}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-background/70 p-1 text-xs truncate">
        {file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}
      </div>
    </div>
  );
};

export default ImagePreview;
