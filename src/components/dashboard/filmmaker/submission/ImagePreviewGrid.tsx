
import React from "react";
import ImagePreview from "./ImagePreview";

interface ImagePreviewGridProps {
  files: File[];
  onRemove: (index: number) => void;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {files.map((file, index) => (
        <ImagePreview 
          key={index} 
          file={file} 
          index={index} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  );
};

export default ImagePreviewGrid;
