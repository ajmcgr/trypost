import { useMemo, useState, type SyntheticEvent } from 'react';
import { cn } from '@/lib/utils';

export type PreviewMedia = {
  url: string;
  kind: 'image' | 'video';
  width?: number;
  height?: number;
};

type MediaPreviewProps = {
  media: PreviewMedia;
  alt?: string;
  controls?: boolean;
  muted?: boolean;
  variant?: 'composer' | 'card' | 'thumb';
  className?: string;
};

const maxHeightByVariant = {
  composer: 'max-h-[70vh]',
  card: 'max-h-72',
  thumb: 'max-h-24',
};

const sizeByVariant = {
  composer: 'w-full',
  card: 'w-full',
  thumb: 'h-24 w-24',
};

const MediaPreview = ({
  media,
  alt = 'Media preview',
  controls = true,
  muted = false,
  variant = 'composer',
  className,
}: MediaPreviewProps) => {
  const [dimensions, setDimensions] = useState(
    media.width && media.height ? { width: media.width, height: media.height } : null,
  );

  const isPortrait = useMemo(
    () => Boolean(dimensions && dimensions.height > dimensions.width),
    [dimensions],
  );

  const mediaClassName = cn(
    'block rounded-md object-contain',
    maxHeightByVariant[variant],
    variant === 'thumb'
      ? 'h-full w-full'
      : isPortrait
        ? 'w-auto max-w-full'
        : 'h-auto w-auto max-w-full',
  );

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (!dimensions && image.naturalWidth && image.naturalHeight) {
      setDimensions({ width: image.naturalWidth, height: image.naturalHeight });
    }
  };

  const handleVideoLoad = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (!dimensions && video.videoWidth && video.videoHeight) {
      setDimensions({ width: video.videoWidth, height: video.videoHeight });
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-lg border bg-muted/30',
        sizeByVariant[variant],
        className,
      )}
    >
      {media.kind === 'image' ? (
        <img src={media.url} alt={alt} className={mediaClassName} onLoad={handleImageLoad} />
      ) : (
        <video
          src={media.url}
          className={mediaClassName}
          controls={controls}
          muted={muted}
          preload="metadata"
          onLoadedMetadata={handleVideoLoad}
        />
      )}
    </div>
  );
};

export default MediaPreview;
