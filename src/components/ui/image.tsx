
export default function Image({ src, alt, width, height, className, fill, style, priority, ...props }: any) {
  // If src is an object (Next.js image import), try to use src.src
  const imageSrc = typeof src === 'object' && src !== null ? src.src : src;
  
  return (
    <img 
      src={imageSrc} 
      alt={alt || ''} 
      width={width} 
      height={height} 
      className={className} 
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={fill ? { position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent', objectFit: 'cover', ...style } : style}
      {...props} 
    />
  );
}
