"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string; // Include country code without + (e.g., "94771234567")
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showTooltip?: boolean;
}

// WhatsApp Logo SVG Component
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516z"/>
  </svg>
);

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Hello! I'm interested in learning more about Learnova Academy. Could you please provide me with information about your programs?",
  position = 'bottom-right',
  showTooltip = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show button after page loads - reduced timing
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Show tooltip after 1.5 seconds if user hasn't interacted
      if (showTooltip && !hasInteracted) {
        setTimeout(() => {
          setShowTooltipState(true);
          
          // Auto-hide tooltip after 4 seconds
          setTimeout(() => {
            setShowTooltipState(false);
          }, 4000);
        }, 1500);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [showTooltip, hasInteracted]);

  const handleWhatsAppClick = () => {
    setHasInteracted(true);
    setShowTooltipState(false);
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleTooltipClose = () => {
    setShowTooltipState(false);
    setHasInteracted(true);
  };

  const positionClasses = {
    'bottom-right': 'bottom-10 right-10',
    'bottom-left': 'bottom-10 left-10'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={`fixed ${positionClasses[position]} z-50`}>
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltipState && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`absolute bottom-full mb-4 ${
                  position === 'bottom-right' ? 'right-0' : 'left-0'
                } w-72`}
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 relative">
                  {/* Tooltip Arrow */}
                  <div className={`absolute top-full ${
                    position === 'bottom-right' ? 'right-6' : 'left-6'
                  } w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white`} />
                  
                  {/* Close Button */}
                  <button
                    onClick={handleTooltipClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {/* Content */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm font-inter mb-1">
                        Need Help?
                      </h4>
                      <p className="text-gray-600 text-xs font-inter leading-relaxed">
                        Chat with us on WhatsApp for instant support about our programs and admissions!
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsAppClick}
                    className="w-full mt-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-2 px-4 rounded-lg text-sm font-medium font-inter transition-colors flex items-center justify-center"
                  >
                    <WhatsAppIcon className="w-4 h-4 mr-2 text-white" />
                    Start Chat
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main WhatsApp Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWhatsAppClick}
            className="relative group"
          >
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-75 animate-ping" />
            <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-50 animate-pulse" />
            
            {/* Main Button */}
            <div className="relative w-12 h-12 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <WhatsAppIcon className="w-7 h-7 text-white" />
            </div>

            {/* Online Status Indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#34E77C] border-2 border-white rounded-full">
              <div className="w-full h-full bg-[#34E77C] rounded-full animate-pulse" />
            </div>
          </motion.button>

          {/* Hover Tooltip (Desktop only) */}
          <div className={`absolute bottom-full mb-3 ${
            position === 'bottom-right' ? 'right-0' : 'left-0'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block`}>
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-inter whitespace-nowrap">
              Chat with us on WhatsApp
              <div className={`absolute top-full ${
                position === 'bottom-right' ? 'right-4' : 'left-4'
              } w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900`} />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;