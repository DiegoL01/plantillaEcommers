import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, SlidersHorizontal } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { setFilters, clearFilters, fetchCategories } from '../../features/products/productSlice'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { capitalizeFirst } from '../../lib/utils'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export const ProductFilters = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  
  const { categories, filters, filteredItems } = useAppSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      dispatch(setFilters({ category }))
    }
  }, [searchParams, dispatch])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    dispatch(setFilters({ category: value }))
    if (value) {
      setSearchParams({ category: value })
    } else {
      setSearchParams({})
    }
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sortBy: e.target.value as typeof filters.sortBy }))
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0
    const newRange: [number, number] =
      type === 'min'
        ? [numValue, filters.priceRange[1]]
        : [filters.priceRange[0], numValue]
    dispatch(setFilters({ priceRange: newRange }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchParams({})
  }

  const hasActiveFilters =
    filters.category ||
    filters.searchQuery ||
    filters.sortBy !== 'default' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((cat) => ({
      value: cat,
      label: capitalizeFirst(cat),
    })),
  ]

  const sortOptions = [
    { value: 'default', label: 'Ordenar por' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Valorados' },
  ]

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          className="w-full justify-center"
        >
          {isOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
      </div>

      {/* Filters Container */}
      <div
        className={cn(
          'bg-card rounded-xl border border-border p-4 space-y-4',
          'lg:block',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Filtros</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              leftIcon={<X className="w-4 h-4" />}
            >
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <Select
            label="Categoría"
            value={filters.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
          />

          {/* Sort Filter */}
          <Select
            label="Ordenar"
            value={filters.sortBy}
            onChange={handleSortChange}
            options={sortOptions}
          />

          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Precio Mínimo
            </label>
            <input
              type="number"
              min="0"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="€0"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Precio Máximo
            </label>
            <input
              type="number"
              min="0"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="€1000"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} producto{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
