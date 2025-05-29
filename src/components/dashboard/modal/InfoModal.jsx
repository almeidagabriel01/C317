import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const InfoModal = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          className="relative bg-gray-800 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl border border-gray-700"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          {/* Content */}
          <div className="pr-8">
            <h3 className="text-xl font-bold text-amber-300 mb-3 font-serif">
              {title}
            </h3>
            <p className="text-gray-300 leading-relaxed font-sans">
              {description}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InfoModal;