
import React from "react";
import { Upload } from "lucide-react";

interface UploadDropAreaProps {
  title: string;
  description: string;
  fileTypes: string;
  onClick: (e: React.MouseEvent) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

const UploadDropArea: React.FC<UploadDropAreaProps> = ({
  title,
  description,
  fileTypes,
  onClick,
  onDrop,
  onDragOver,
  children
}) => {
  return (
    <div 
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
};

export default UploadDropArea;
