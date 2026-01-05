import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function BrandsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  const brands = [
    { id: 1, name: 'Ecolunes Baby', logo: 'public/images/12.jpg' },
    { id: 2, name: 'Pingo', logo: 'public/images/24.jpg' },
    { id: 3, name: 'Philips Avent', logo: 'public/images/48.jpg' },
    { id: 4, name: 'Benecos', logo: 'public/images/88.jpg' },
    { id: 5, name: 'Cattier', logo: 'public/images/656.jpg' },
    { id: 6, name: 'La Roche-Posay', logo: 'public/images/787.jpg' },
    { id: 7, name: 'Vichy', logo: 'public/images/896.jpg' },
    { id: 8, name: 'Bioderma', logo: 'public/images/1120.jpg' },
  ];

  // Responsive: ajuster le nombre de logos par slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(2); // Mobile: 2 logos
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3); // Tablet: 3 logos
      } else {
        setItemsPerSlide(5); // Desktop: 5 logos
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(brands.length / itemsPerSlide);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-8 md:mb-12 text-center md:text-left">
          Nos prestigieuses marques
        </h2>

        <div className="relative px-8 md:px-12">
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className="min-w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
                >
                  {brands
                    .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                    .map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center justify-center bg-white rounded-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-24 md:h-32 group"
                      >
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="max-h-[10rem] md:max-h-[10rem] max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${brand.name}&size=150&background=3E5F44&color=fff`;
                          }}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-[#3E5F44]' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandsSection;