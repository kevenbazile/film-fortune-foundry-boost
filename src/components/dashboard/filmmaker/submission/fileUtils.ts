
// Helper functions for file operations
export const getFileSize = (file: File): string => {
  const fileSizeInMB = file.size / (1024 * 1024);
  return fileSizeInMB.toFixed(2) + ' MB';
};

export const isVideoFile = (fileName: string): boolean => {
  const videoExtensions = ['mp4', 'mov', 'avi', 'dvi'];
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return videoExtensions.includes(extension);
};

export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png'];
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return imageExtensions.includes(extension);
};

// Function to create a preview URL for an image file
export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

// Function to release a created object URL to free memory
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};
