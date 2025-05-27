"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX } from "react-icons/fi";

const CreateItemModal = ({ isOpen, onClose, onSave }) => {
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    "Alcoólico",
    "Não Alcoólico",
    "Shots",
    "Outras Bebidas",
    "Estruturas",
    "Funcionário",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setItemData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeImage = () => {
    setItemData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...itemData,
      price: parseFloat(itemData.price) || 0,
      status: "Ativo",
      image: imagePreview, // In a real app, you'd upload the file and get a URL
    });
    handleClose();
  };

  const handleClose = () => {
    setItemData({
      name: "",
      description: "",
      category: "",
      price: "",
      image: null,
    });
    setImagePreview(null);
    setIsDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose}
      >
        <motion.div
          className="relative bg-[#1C2431] w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#E0CEAA] mb-6 font-serif">
              Criar Novo Item
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1 font-sans"
                  >
                    Nome do Item
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={itemData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1 font-sans"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={itemData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-1 font-sans"
                  >
                    Categoria
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={itemData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-300 mb-1 font-sans"
                  >
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={itemData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                    Imagem do Item
                  </label>

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg bg-gray-700"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-amber-500 bg-amber-500 bg-opacity-10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400 font-sans">
                        Clique para selecionar ou arraste uma imagem aqui
                      </p>
                      <p className="text-xs text-gray-500 mt-2 font-sans">
                        PNG, JPG, GIF até 5MB
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-full text-white hover:bg-gray-700 transition-colors font-sans font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#9D4815] hover:bg-amber-600 rounded-full text-white transition-colors font-sans font-medium"
                >
                  Criar Item
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateItemModal;
