'use client'
import { useState } from 'react'

const IMAGE_COUNT = 10
const IMAGE_PATH = '/images/image-gallery'

export default function ImageGalleryBar() {
  const [isPaused, setIsPaused] = useState(false)

  const images = Array.from(
    { length: IMAGE_COUNT }, 
    (_, i) => `${IMAGE_PATH}/taxi-srilanka-tours-image-gallery-${i + 1}.jpg`
  )

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images]

  return (
    <section
      className="w-full overflow-hidden py-12 bg-gradient-to-b from-purple-50 to-white"
      aria-labelledby="tour-memories-title"
    >
      <div className="mx-auto max-w-screen-xl px-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 
              id="tour-memories-title" 
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Tour Memories
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Captured moments from our travellers — highlights from recent journeys.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-medium">
              Explore
            </span>
          </div>
        </div>
      </div>

      <div 
        className="gallery-container relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          className={`gallery-track flex gap-4 ${isPaused ? 'paused' : ''}`}
        >
          {duplicatedImages.map((src, idx) => (
            <div 
              key={`gallery-${idx}`}
              className="gallery-item flex-shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                src={src}
                alt={`Taxi Sri Lanka gallery ${(idx % IMAGE_COUNT) + 1}`}
                className="gallery-img rounded-xl shadow-lg object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm">
        Hover to pause • Discover amazing destinations across Sri Lanka
      </p>

      <style jsx>{`
        .gallery-container {
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 5%,
            black 95%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 5%,
            black 95%,
            transparent
          );
        }

        .gallery-track {
          animation: scroll 40s linear infinite;
          will-change: transform;
        }

        .gallery-track.paused {
          animation-play-state: paused;
        }

        .gallery-item {
          width: 480px;
          height: 300px;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          background-color: #f3f4f6;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-480px * ${IMAGE_COUNT} - ${IMAGE_COUNT * 16}px));
          }
        }

        @media (max-width: 1024px) {
          .gallery-item {
            width: 360px;
            height: 220px;
          }

          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-360px * ${IMAGE_COUNT} - ${IMAGE_COUNT * 16}px));
            }
          }
        }

        @media (max-width: 768px) {
          .gallery-item {
            width: 280px;
            height: 180px;
          }

          .gallery-track {
            animation-duration: 30s;
          }

          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-280px * ${IMAGE_COUNT} - ${IMAGE_COUNT * 16}px));
            }
          }
        }
      `}</style>
    </section>
  )
}