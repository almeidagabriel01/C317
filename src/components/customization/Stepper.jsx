"use client";

import { usePathname } from "next/navigation";

const steps = [
  { label: "Informações" },
  { label: "Bebidas Alcoólicas" },
  { label: "Bebidas não alcoólicas" },
  { label: "Outras bebidas" },
  { label: "Shots" },
  { label: "Estrutura" },
  { label: "Bartender" },
];

export default function Stepper() {
  const pathname = usePathname();
  const stepIndex = steps.findIndex((_, i) =>
    pathname.includes(`/personalizar-${i + 1}`)
  );
  const currentStep = stepIndex >= 0 ? stepIndex : 0;

  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center ">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#CC5E00] ${
                i === currentStep ? "bg-[#CC5E00]" : "bg-transparent"
              }`}
            />
            {i < steps.length - 1 && (
              <div className="w-8 sm:w-12 h-[2px] bg-[#CC5E00]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
