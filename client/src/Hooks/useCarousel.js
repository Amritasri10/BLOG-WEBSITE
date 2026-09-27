import { useState, useEffect } from "react";
import { CAROUSEL_IMAGES, CAROUSEL_INTERVAL } from "../constants/staticData";

/**
 * useCarousel — auto-cycles through CAROUSEL_IMAGES.
 * Returns the current image src and index.
 */
const useCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return {
    currentImage: CAROUSEL_IMAGES[currentIndex],
    currentIndex,
    total: CAROUSEL_IMAGES.length,
  };
};

export default useCarousel;
