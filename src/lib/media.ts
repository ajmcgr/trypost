export type MediaDimensions = {
  width: number;
  height: number;
};

export const getFileMediaDimensions = (file: File): Promise<MediaDimensions | null> => {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);

    if (file.type.startsWith('image/')) {
      const image = new Image();
      image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        cleanup();
        resolve(width && height ? { width, height } : null);
      };
      image.onerror = () => {
        cleanup();
        resolve(null);
      };
      image.src = url;
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      cleanup();
      resolve(width && height ? { width, height } : null);
    };
    video.onerror = () => {
      cleanup();
      resolve(null);
    };
    video.src = url;
  });
};
