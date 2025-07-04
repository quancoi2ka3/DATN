"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  selectedRatings: number[];
  sortBy: string;
  viewMode: 'grid' | 'list';
}

export interface ProductFilterContextType {
  // State
  allProducts: Product[];
  filteredProducts: Product[];
  filterState: FilterState;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  isLoading: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleRating: (rating: number) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  // Computed values
  getCurrentPageProducts: () => Product[];
  getUniqueCategories: () => string[];
  getUniqueBrands: () => string[];
  getPriceRangeMinMax: () => [number, number];
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

interface ProductFilterProviderProps {
  children: ReactNode;
  initialProducts?: Product[];
}

export function ProductFilterProvider({ children, initialProducts = [] }: ProductFilterProviderProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedCategories: [],
    selectedBrands: [],
    priceRange: [0, 1000000],
    selectedRatings: [],
    sortBy: 'default',
    viewMode: 'grid',
  });

  // Set products function
  const setProducts = useCallback((products: Product[]) => {
    setAllProducts(products);
    setFilteredProducts(products);
    setCurrentPage(1);
  }, []);

  // Filter and sort functions
  const applyFilters = useCallback(() => {
    setIsLoading(true);
    
    let filtered = [...allProducts];

    // Apply search filter
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        String(product.category).toLowerCase().includes(query) ||
        product.subCategory?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filterState.selectedCategories.length > 0 && !filterState.selectedCategories.includes('all')) {
      filtered = filtered.filter(product =>
        filterState.selectedCategories.includes(String(product.category))
      );
    }

    // Apply brand filter
    if (filterState.selectedBrands.length > 0 && !filterState.selectedBrands.includes('all')) {
      filtered = filtered.filter(product =>
        product.brand && filterState.selectedBrands.includes(product.brand)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price;
      return price >= filterState.priceRange[0] && price <= filterState.priceRange[1];
    });

    // Apply rating filter
    if (filterState.selectedRatings.length > 0) {
      filtered = filtered.filter(product =>
        product.rating && filterState.selectedRatings.some(rating => 
          Math.floor(product.rating!) >= rating
        )
      );
    }

    // Apply sorting
    switch (filterState.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
    setIsLoading(false);
  }, [allProducts, filterState]);

  // Apply filters whenever filterState changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Action functions
  const setSearchQuery = useCallback((query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setSortBy = useCallback((sortBy: string) => {
    setFilterState(prev => ({ ...prev, sortBy }));
  }, []);

  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setFilterState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilterState(prev => {
      const categories = [...prev.selectedCategories];
      if (category === 'all') {
        return { ...prev, selectedCategories: [] };
      }
      
      const index = categories.indexOf(category);
      if (index > -1) {
        categories.splice(index, 1);
      } else {
        categories.push(category);
      }
      return { ...prev, selectedCategories: categories };
    });
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setFilterState(prev => {
      const brands = [...prev.selectedBrands];
      if (brand === 'all') {
        return { ...prev, selectedBrands: [] };
      }
      
      const index = brands.indexOf(brand);
      if (index > -1) {
        brands.splice(index, 1);
      } else {
        brands.push(brand);
      }
      return { ...prev, selectedBrands: brands };
    });
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    setFilterState(prev => ({ ...prev, priceRange: range }));
  }, []);

  const toggleRating = useCallback((rating: number) => {
    setFilterState(prev => {
      const ratings = [...prev.selectedRatings];
      const index = ratings.indexOf(rating);
      if (index > -1) {
        ratings.splice(index, 1);
      } else {
        ratings.push(rating);
      }
      return { ...prev, selectedRatings: ratings };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      searchQuery: '',
      selectedCategories: [],
      selectedBrands: [],
      priceRange: [0, 1000000],
      selectedRatings: [],
      sortBy: 'default',
      viewMode: 'grid',
    });
  }, []);

  // Computed values
  const getCurrentPageProducts = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getUniqueCategories = useCallback(() => {
    const categories = new Set(allProducts.map(p => String(p.category)));
    return Array.from(categories);
  }, [allProducts]);

  const getUniqueBrands = useCallback(() => {
    const brands = new Set(allProducts.map(p => p.brand).filter(Boolean) as string[]);
    return Array.from(brands);
  }, [allProducts]);

  const getPriceRangeMinMax = useCallback((): [number, number] => {
    if (allProducts.length === 0) return [0, 1000000];
    
    const prices = allProducts.map(p => p.salePrice || p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const contextValue: ProductFilterContextType = {
    // State
    allProducts,
    filteredProducts,
    filterState,
    currentPage,
    itemsPerPage,
    totalPages,
    isLoading,

    // Actions
    setProducts,
    setSearchQuery,
    setSortBy,
    setViewMode,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    toggleRating,
    setCurrentPage,
    setItemsPerPage,
    clearFilters,
    applyFilters,

    // Computed values
    getCurrentPageProducts,
    getUniqueCategories,
    getUniqueBrands,
    getPriceRangeMinMax,
  };

  return (
    <ProductFilterContext.Provider value={contextValue}>
      {children}
    </ProductFilterContext.Provider>
  );
}

export function useProductFilter() {
  const context = useContext(ProductFilterContext);
  if (context === undefined) {
    throw new Error('useProductFilter must be used within a ProductFilterProvider');
  }
  return context;
}
