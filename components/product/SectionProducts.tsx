"use client"
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Truck, Shield, CreditCard } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../lib/hooks'
import { fetchProducts } from '../../lib/features/productSlice'
import { useToast } from '../../hooks/useToast'
import { ProductCard } from '../../components/product/ProductCard'
import { ProductFiltersWrapper } from '@/components/product/ProductFiltersWrapper' 
import { ProductCardSkeleton } from '../../components/ui/custom-skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { Package } from "lucide-react"

export const SectionProducts = () => {
    const dispatch = useAppDispatch()
    const { showError } = useToast()
    
    const { filteredItems, loading, error } = useAppSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchProducts() as any)
    }, [dispatch])

    useEffect(() => {
        if (error) {
            showError(error)
        }
    }, [error, showError])

    return (<>
        {/* Products Section */}
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                {/* Filters - Full Width */}
                <div className="mb-8">
                    <ProductFiltersWrapper />
                </div>

                {/* Products Grid */}
                <div>
                    <div className="mb-6">
                        <h2 className="font-serif text-3xl font-bold">Productos</h2>
                        <p className="text-muted-foreground mt-1">
                            {loading ? 'Cargando...' : `${filteredItems.length} productos encontrados`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                            {[...Array(6)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredItems.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Package className="w-16 h-16" />}
                            title="No hay productos"
                            description="Prueba con otros filtros"
                        />
                    )}
                </div>
            </div>
        </section>
    </>
    )
}
