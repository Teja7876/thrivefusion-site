
export default function Link({ href, children, className, ...props }: any) {
  // Extract path to avoid passing object routing if present
  const linkHref = typeof href === 'object' && href !== null ? href.pathname : href;
  
  return (
    <a href={linkHref} className={className} {...props}>
      {children}
    </a>
  );
}
