import { useState, useEffect } from "react";

export default function useCheckForMobile() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const resizeListener = () => {
      setWidth(() => window.innerWidth);
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return width;
}
