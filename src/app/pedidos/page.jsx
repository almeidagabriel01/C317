"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiList, FiCheckCircle } from "react-icons/fi";
import Navbar from "@/components//navbar/Navbar";
import OrderDetailsModal from "@/components/orders/modals/OrderDetailsModal";
import ConfirmationModal from "@/components/orders/modals/ConfirmationModal";
import OrderSearchBar from "@/components/orders/list/OrderSearchBar";
import OrderTable from "@/components/orders/list/OrderTable";

// Sample order data
const SAMPLE_ORDERS = [
  {
    id: 1001,
    customerName: "João Silva",
    customerEmail: "joao@example.com",
    customerPhone: "(11) 98765-4321",
    date: "2024-05-20T10:30:00",
    convidados: 80,
    total: 27327.25,
    status: "Pendente",
    deliveryAddress: "Rua das Flores, 123 - São Paulo, SP",
    items: [
      { name: "Moscow mule", price: 2000, total: 2000 },
      { name: "Sex on the beach", price: 2000, total: 2000 },
      { name: "Mojito", price: 2000, total: 2000 },
      { name: "Bellini", price: 2000, total: 2000 },
      { name: "Blood Mary", price: 2000, total: 2000 },
      { name: "Gin Tônica", price: 2000, total: 2000 },
      { name: "Caipirinhas", price: 2000, total: 2000 },
      { name: "Pink Lemonade", price: 1250.75, total: 1250.75 },
      { name: "Sonho brilhante", price: 1250.75, total: 1250.75 },
      { name: "Pina descolada", price: 1250.75, total: 1250.75 },
      { name: "Cerveja", quantity: 500, price: 12.15, total: 6075 },
      { name: "Espumante Salton Brut", quantity: 5, price: 40, total: 200 },
      { name: "Mini beer", quantity: 3, price: 600, total: 1800 },
      { name: "Bartender", quantity: 5, price: 300, total: 1500 },
    ],
    notes: "Pedido para casamento.",
  },
  {
    id: 1002,
    customerName: "Maria Oliveira",
    customerEmail: "maria@example.com",
    customerPhone: "(11) 91234-5678",
    date: "2024-05-19T14:15:00",
    convidados: 80,
    total: 27327.25,
    status: "Pendente",
    deliveryAddress: "Av. Paulista, 456 - São Paulo, SP",
    item: [
      { name: "Moscow mule", price: 2000, total: 2000 },
      { name: "Sex on the beach", price: 2000, total: 2000 },
      { name: "Mojito", price: 2000, total: 2000 },
      { name: "Bellini", price: 2000, total: 2000 },
      { name: "Blood Mary", price: 2000, total: 2000 },
      { name: "Gin Tônica", price: 2000, total: 2000 },
      { name: "Caipirinhas", price: 2000, total: 2000 },
      { name: "Pink Lemonade", price: 1250.75, total: 1250.75 },
      { name: "Sonho brilhante", price: 1250.75, total: 1250.75 },
      { name: "Pina descolada", price: 1250.75, total: 1250.75 },
      { name: "Cerveja", quantity: 500, price: 12.15, total: 6075 },
      { name: "Espumante Salton Brut", quantity: 5, price: 40, total: 200 },
      { name: "Mini beer", quantity: 3, price: 600, total: 1800 },
      { name: "Bartender", quantity: 5, price: 300, total: 1500 },
    ],
    notes: "Pedido para aniversário.",
  },
  {
    id: 1003,
    customerName: "Pedro Santos",
    customerEmail: "pedro@example.com",
    customerPhone: "(11) 99876-5432",
    date: "2024-05-18T09:45:00",
    convidados: 80,
    total: 27327.25,
    status: "Revisado",
    deliveryAddress: "Rua do Comércio, 789 - São Paulo, SP",
    items: [
      { name: "Moscow mule", price: 2000, total: 2000 },
      { name: "Sex on the beach", price: 2000, total: 2000 },
      { name: "Mojito", price: 2000, total: 2000 },
      { name: "Bellini", price: 2000, total: 2000 },
      { name: "Blood Mary", price: 2000, total: 2000 },
      { name: "Gin Tônica", price: 2000, total: 2000 },
      { name: "Caipirinhas", price: 2000, total: 2000 },
      { name: "Pink Lemonade", price: 1250.75, total: 1250.75 },
      { name: "Sonho brilhante", price: 1250.75, total: 1250.75 },
      { name: "Pina descolada", price: 1250.75, total: 1250.75 },
      { name: "Cerveja", quantity: 500, price: 12.15, total: 6075 },
      { name: "Espumante Salton Brut", quantity: 5, price: 40, total: 200 },
      { name: "Mini beer", quantity: 3, price: 600, total: 1800 },
      { name: "Bartender", quantity: 5, price: 300, total: 1500 },
    ],
    notes: "Pedido para casamento",
  },
  {
    id: 1004,
    customerName: "Ana Ferreira",
    customerEmail: "ana@example.com",
    customerPhone: "(11) 95555-4444",
    date: "2024-05-17T16:20:00",
    convidados: 80,
    total: 27327.25,
    status: "Pendente",
    deliveryAddress: "Praça da República, 321 - São Paulo, SP",
    items: [
      { name: "Moscow mule", price: 2000, total: 2000 },
      { name: "Sex on the beach", price: 2000, total: 2000 },
      { name: "Mojito", price: 2000, total: 2000 },
      { name: "Bellini", price: 2000, total: 2000 },
      { name: "Blood Mary", price: 2000, total: 2000 },
      { name: "Gin Tônica", price: 2000, total: 2000 },
      { name: "Caipirinhas", price: 2000, total: 2000 },
      { name: "Pink Lemonade", price: 1250.75, total: 1250.75 },
      { name: "Sonho brilhante", price: 1250.75, total: 1250.75 },
      { name: "Pina descolada", price: 1250.75, total: 1250.75 },
      { name: "Cerveja", quantity: 500, price: 12.15, total: 6075 },
      { name: "Espumante Salton Brut", quantity: 5, price: 40, total: 200 },
      { name: "Mini beer", quantity: 3, price: 600, total: 1800 },
      { name: "Bartender", quantity: 5, price: 300, total: 1500 },
    ],
    notes: "Pedido para casamento",
  },
  {
    id: 1005,
    customerName: "Carlos Costa",
    customerEmail: "carlos@example.com",
    customerPhone: "(11) 96666-7777",
    date: "2024-05-16T11:10:00",
    convidados: 80,
    total: 27327.25,
    status: "Revisado",
    deliveryAddress: "Rua Augusta, 654 - São Paulo, SP",
    items: [
      { name: "Moscow mule", price: 2000, total: 2000 },
      { name: "Sex on the beach", price: 2000, total: 2000 },
      { name: "Mojito", price: 2000, total: 2000 },
      { name: "Bellini", price: 2000, total: 2000 },
      { name: "Blood Mary", price: 2000, total: 2000 },
      { name: "Gin Tônica", price: 2000, total: 2000 },
      { name: "Caipirinhas", price: 2000, total: 2000 },
      { name: "Pink Lemonade", price: 1250.75, total: 1250.75 },
      { name: "Sonho brilhante", price: 1250.75, total: 1250.75 },
      { name: "Pina descolada", price: 1250.75, total: 1250.75 },
      { name: "Cerveja", quantity: 500, price: 12.15, total: 6075 },
      { name: "Espumante Salton Brut", quantity: 5, price: 40, total: 200 },
      { name: "Mini beer", quantity: 3, price: 600, total: 1800 },
      { name: "Bartender", quantity: 5, price: 300, total: 1500 },
    ],
    notes: "Pedido para evento corporativo.",
  },
  {
    id: 1006,
    customerName: "Luciana Mendes",
    customerEmail: "luciana@example.com",
    customerPhone: "(11) 97777-8888",
    date: "2024-05-15T13:30:00",
    convidados: 80,
    total: 27327.25,
    status: "Pendente",
    deliveryAddress: "Rua Oscar Freire, 987 - São Paulo, SP",
    items: [
      { name: "Moscow mule", price: 2000, total: 2000 },
      { name: "Sex on the beach", price: 2000, total: 2000 },
      { name: "Mojito", price: 2000, total: 2000 },
      { name: "Bellini", price: 2000, total: 2000 },
      { name: "Blood Mary", price: 2000, total: 2000 },
      { name: "Gin Tônica", price: 2000, total: 2000 },
      { name: "Caipirinhas", price: 2000, total: 2000 },
      { name: "Pink Lemonade", price: 1250.75, total: 1250.75 },
      { name: "Sonho brilhante", price: 1250.75, total: 1250.75 },
      { name: "Pina descolada", price: 1250.75, total: 1250.75 },
      { name: "Cerveja", quantity: 500, price: 12.15, total: 6075 },
      { name: "Espumante Salton Brut", quantity: 5, price: 40, total: 200 },
      { name: "Mini beer", quantity: 3, price: 600, total: 1800 },
      { name: "Bartender", quantity: 5, price: 300, total: 1500 },
    ],
    notes: "Pedido para evento corporativo.",
  },
];

export default function GerenciarPedidos() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewedOrders, setShowReviewedOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToReview, setOrderToReview] = useState(null);

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Authentication check

  // Filter orders based on search term and view type
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);

    const matchesStatus = showReviewedOrders
      ? order.status === "Revisado"
      : order.status === "Pendente";

    return matchesSearch && matchesStatus;
  });

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Handle mark as reviewed
  const handleMarkAsReviewed = (order) => {
    setOrderToReview(order);
    setIsConfirmModalOpen(true);
  };

  // Confirm review action
  const handleConfirmReview = () => {
    if (orderToReview) {
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderToReview.id ? { ...o, status: "Revisado" } : o
        )
      );
      toast.success(`Pedido #${orderToReview.id} marcado como revisado!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 lg:ml-12 lg:mr-12">
          <h1 className="text-3xl font-bold text-amber-400 font-serif">
            Gerenciar Pedidos
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
            {/* Toggle buttons */}
            <div className="flex bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setShowReviewedOrders(false)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors font-sans font-medium ${
                  !showReviewedOrders
                    ? "bg-amber-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <FiList className="mr-2" />
                Pendentes
              </button>
              <button
                onClick={() => setShowReviewedOrders(true)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors font-sans font-medium ${
                  showReviewedOrders
                    ? "bg-amber-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <FiCheckCircle className="mr-2" />
                Revisados
              </button>
            </div>

            {/* Search bar component */}
            <OrderSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Order table component */}
        <OrderTable
          orders={filteredOrders}
          onViewOrder={handleViewOrder}
          onMarkAsReviewed={handleMarkAsReviewed}
          showReviewedOrders={showReviewedOrders}
        />
      </main>

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmReview}
        title="Marcar como Revisado"
        message={`Tem certeza que deseja marcar o pedido #${orderToReview?.id} como revisado?`}
        actionText="Marcar como Revisado"
      />
    </div>
  );
}
