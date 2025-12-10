import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type CarrosselImage = {
  src: string;
  alt: string;
  link: string;
};

type CarouselProps = {
  imagens: CarrosselImage[];
  intervalo?: number;
};

export default function Carrossel({
  imagens,
  intervalo = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imagens.length - 1 ? 0 : prevIndex + 1,
      );
    }, intervalo);

    return () => clearInterval(timer);
  }, [imagens.length, intervalo]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagens.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imagens.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative mx-auto min-h-60 w-full max-w-4xl overflow-hidden">
      {imagens.map((image, index) => (
        <a
          key={index}
          href={image.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="h-auto w-full cursor-pointer object-cover"
          />
        </a>
      ))}

      <FaChevronLeft
        size={36}
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white opacity-75 hover:opacity-100"
      />
      <FaChevronRight
        size={36}
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white opacity-75 hover:opacity-100"
      />

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2 rounded-full bg-gray-800 p-2">
        {imagens.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full ${
              index === currentIndex
                ? "bg-white opacity-100"
                : "bg-gray-400 opacity-75"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
