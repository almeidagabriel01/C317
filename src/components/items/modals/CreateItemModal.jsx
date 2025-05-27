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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: "alcoolicos", label: "Alcoólicos" },
    { value: "nao_alcoolicos", label: "Não Alcoólicos" },
    { value: "shots", label: "Shots" },
    { value: "outras_bebidas", label: "Outras Bebidas" },
    { value: "estrutura", label: "Estruturas" },
    { value: "funcionarios", label: "Funcionários" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Formatação em tempo real do preço
      const formattedPrice = formatPriceInput(value);
      setItemData((prev) => ({ ...prev, [name]: formattedPrice }));
    } else {
      setItemData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Função para formatar o preço enquanto digita
  const formatPriceInput = (value) => {
    // Remove tudo que não é dígito
    let numbers = value.replace(/\D/g, '');
    
    // Se vazio, retorna vazio
    if (numbers === '') return '';
    
    // Converte para número e divide por 100 para ter centavos
    let amount = parseInt(numbers) / 100;
    
    // Formata com vírgula decimal brasileira
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para converter o valor formatado de volta para número
  const parsePriceValue = (formattedValue) => {
    if (!formattedValue) return 0;
    // Remove pontos de milhares e converte vírgula para ponto
    return parseFloat(formattedValue.replace(/\./g, '').replace(',', '.')) || 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...itemData,
        price: parsePriceValue(itemData.price), // Converte preço formatado para número
        status: "Ativo", // Items são criados como ativos por padrão
      });
      handleClose();
    } catch (error) {
      console.error('Erro ao criar item:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    setIsSubmitting(false);
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
          className="relative bg-[#1C2431] w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com X */}
          <div className="sticky top-0 z-10 bg-[#1C2431] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#E0CEAA] font-serif">
              Criar Novo Item
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white disabled:opacity-50"
              title="Fechar modal"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Conteúdo com scroll customizado */}
          <div className="p-6 custom-scrollbar">
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans resize-none disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans disabled:opacity-50"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                    type="text"
                    id="price"
                    name="price"
                    value={itemData.price}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans disabled:opacity-50"
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
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isSubmitting 
                          ? "opacity-50 cursor-not-allowed" 
                          : isDragActive
                          ? "border-amber-500 bg-amber-500 bg-opacity-10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => !isSubmitting && fileInputRef.current?.click()}
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
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-full text-white hover:bg-gray-700 transition-colors font-sans font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#9D4815] hover:bg-amber-600 rounded-full text-white transition-colors font-sans font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    "Criar Item"
                  )}
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