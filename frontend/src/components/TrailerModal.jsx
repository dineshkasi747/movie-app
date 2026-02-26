import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const TrailerModal = ({ trailer, onClose }) => {

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!trailer) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose} // Click outside to close
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-white font-semibold text-lg truncate pr-4">
            🎬 {trailer.name}
          </h3>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 text-white transition-all duration-200"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* YouTube Embed */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl shadow-black"
          style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-gray-500 text-xs uppercase tracking-wider">
            {trailer.type} • {trailer.site}
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Press ESC to close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;