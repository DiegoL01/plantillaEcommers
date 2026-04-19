"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProductFilters } from "../../components/product/ProductFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductFiltersWrapper() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ SKELETON = MISMA ESTRUCTURA EXTERNA QUE EL RESULTADO FINAL
  if (!mounted) {
    return (
      <div className="w-full">
        {/* Botón mobile (oculto en desktop, pero debe existir en el HTML) */}
        <div className="md:hidden mb-4">
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </div>
        {/* Contenedor de filtros */}
        <div className="w-full h-24 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Filtros</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </div>

      {/* Filters - Full width horizontal scroll on mobile */}
      <div className={cn(
        "w-full overflow-x-auto",
        isOpen ? "block" : "hidden md:block"
      )}>
        <ProductFilters />
      </div>
    </div>
  );
}