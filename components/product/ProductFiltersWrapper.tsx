// components/product-filters-wrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductFilters } from '../../components/product/ProductFilters';

export function ProductFiltersWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside className="w-full md:w-48 shrink-0">
        {/* Skeleton placeholder para evitar layout shift */}
        <div className="h-100 bg-gray-100 animate-pulse rounded-md" />
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-48 shrink-0">
      <ProductFilters />
    </aside>
  );
}