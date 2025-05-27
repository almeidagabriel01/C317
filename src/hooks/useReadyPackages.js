// src/hooks/useReadyPackages.js
import { useState, useEffect } from "react";

// Função para inicializar o estado do localStorage de forma segura
const initializeFromStorage = (packageId) => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem(`C317_readyPackage_${packageId}`);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn("Erro ao ler localStorage:", error);
    return {};
  }
};

// Função para salvar no localStorage de forma segura
const saveToStorage = (packageId, data) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(`C317_readyPackage_${packageId}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Erro ao salvar no localStorage:", error);
  }
};

// Função para limpar o localStorage do pacote
const clearStorage = (packageId) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`C317_readyPackage_${packageId}`);
  } catch (error) {
    console.warn("Erro ao limpar localStorage:", error);
  }
};

// Função para validar data no formato yyyy-mm-dd
const isValidDate = (input) => {
  if (!input) return false;
  const [year, month, day] = input.split('-').map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

// Função para validar hora (hh:mm)
const isValidTime = (input) => {
  if (!input) return false;
  const [hh, mm] = input.split(':').map(Number);
  return (
    !isNaN(hh) && !isNaN(mm) &&
    hh >= 0 && hh <= 23 &&
    mm >= 0 && mm <= 59
  );
};

export function useReadyPackages(packageInfo) {
  const packageId = packageInfo?.id;
  const saved = packageId ? initializeFromStorage(packageId) : {};

  const [formData, setFormData] = useState({
    name: saved.formData?.name ?? "",
    date: saved.formData?.date ?? "",
    startTime: saved.formData?.startTime ?? "",
    eventAddress: saved.formData?.eventAddress ?? "",
    eventDuration: saved.formData?.eventDuration ?? (packageInfo ? `0${packageInfo.hours}:00` : "04:00")
  });

  // Effect para salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    if (!packageId) return;

    const toSave = {
      formData
    };
    saveToStorage(packageId, toSave);
  }, [formData, packageId]);

  // Função para reset do formulário
  const resetForm = () => {
    const defaultData = {
      name: "",
      date: "",
      startTime: "",
      eventAddress: "",
      eventDuration: packageInfo ? `0${packageInfo.hours}:00` : "04:00"
    };
    setFormData(defaultData);
    if (packageId) {
      clearStorage(packageId);
    }
  };

  // Função para validação do formulário
  const isFormValid = () => {
    const { name, date, startTime, eventAddress, eventDuration } = formData;
    
    const dateOk = date && isValidDate(date);
    const timeOk = startTime && isValidTime(startTime);
    
    return (
      name.trim() !== "" &&
      dateOk &&
      timeOk &&
      eventAddress.trim() !== "" &&
      eventDuration.trim() !== "" &&
      eventDuration !== "00:00"
    );
  };

  // Função para lidar com mudança de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para lidar com mudança de duração
  const handleDurationChange = (value) => {
    setFormData(prev => ({ ...prev, eventDuration: value }));
  };

  // Função para calcular horário de fim
  const calcularHorarioFim = () => {
    if (!formData.startTime || !formData.eventDuration) return "";
    
    const [startH, startM] = formData.startTime.split(":").map(Number);
    const [durH, durM] = formData.eventDuration.split(":").map(Number);
    
    let totalMinutes = (startH * 60 + startM) + (durH * 60 + durM);
    let endH = Math.floor(totalMinutes / 60) % 24;
    let endM = totalMinutes % 60;
    
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  };

  // Função para gerar o resumo do pedido
  const getResumo = () => {
    if (!packageInfo) return null;

    return {
      tipoEvento: packageInfo.title,
      nome: formData.name,
      data: formData.date,
      eventAddress: formData.eventAddress,
      numConvidados: packageInfo.guests,
      horarioInicio: formData.startTime,
      horarioFim: calcularHorarioFim(),
      valorTotal: packageInfo.priceValue,
      itens: packageInfo.items,
      packageDetails: packageInfo.details
    };
  };

  // Função para limpar dados após sucesso
  const clearData = () => {
    resetForm();
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleDurationChange,
    isFormValid,
    calcularHorarioFim,
    getResumo,
    resetForm,
    clearData
  };
}