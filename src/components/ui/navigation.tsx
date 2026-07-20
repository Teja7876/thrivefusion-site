import { useState, useEffect } from 'react';

export function usePathname() {
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(window.location.pathname);
    
    const handleRouteChange = () => {
      setPathname(window.location.pathname);
    };
    
    document.addEventListener("astro:after-swap", handleRouteChange);
    return () => document.removeEventListener("astro:after-swap", handleRouteChange);
  }, []);

  return pathname;
}
