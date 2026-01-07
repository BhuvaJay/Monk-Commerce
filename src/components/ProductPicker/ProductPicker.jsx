import { memo, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { CloseIcon, SearchIcon } from '../icons';
import { useProductContext } from '../../context/ProductContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { fetchProducts } from '../../services/api';
import { generateId } from '../../utils/helpers';
import ProductPickerItem from './ProductPickerItem';

const ProductPicker = memo(() => {
  const { isPickerOpen, editingProductId, closePicker, replaceProduct } = useProductContext();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState(new Map()); // Map<variantId, { product, variant }>
  
  // Debounced search query for API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Ref for scroll container
  const scrollContainerRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isPickerOpen) {
      setSearchQuery('');
      setProducts([]);
      setPage(0);
      setHasMore(true);
      setSelectedVariants(new Map());
    }
  }, [isPickerOpen]);

  // Track previous search query to detect changes
  const prevSearchRef = useRef(debouncedSearchQuery);

  // Fetch products when search query or page changes
  useEffect(() => {
    const loadProducts = async () => {
      if (!isPickerOpen) return;
      
      // Check if search query changed
      const searchChanged = prevSearchRef.current !== debouncedSearchQuery;
      prevSearchRef.current = debouncedSearchQuery;
      
      // If search changed, reset to page 0
      const currentPage = searchChanged ? 0 : page;
      if (searchChanged && page !== 0) {
        setPage(0);
        return; // Effect will re-run with page = 0
      }
      
      setIsLoading(true);
      try {
        const result = await fetchProducts({
          search: debouncedSearchQuery,
          page: currentPage,
          limit: 10
        });
        
        if (currentPage === 0) {
          setProducts(result.products);
        } else {
          setProducts(prev => [...prev, ...result.products]);
        }
        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearchQuery, page, isPickerOpen]);

  // Load more products
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Infinite scroll ref
  const lastProductRef = useInfiniteScroll(loadMore, hasMore, isLoading);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle product toggle (select/deselect all variants)
  const handleProductToggle = useCallback((product) => {
    setSelectedVariants(prev => {
      const newMap = new Map(prev);
      const allSelected = product.variants.every(v => newMap.has(v.id));
      
      if (allSelected) {
        // Deselect all variants of this product
        product.variants.forEach(v => newMap.delete(v.id));
      } else {
        // Select all variants of this product
        product.variants.forEach(v => {
          newMap.set(v.id, { product, variant: v });
        });
      }
      
      return newMap;
    });
  }, []);

  // Handle individual variant toggle
  const handleVariantToggle = useCallback((product, variant) => {
    setSelectedVariants(prev => {
      const newMap = new Map(prev);
      
      if (newMap.has(variant.id)) {
        newMap.delete(variant.id);
      } else {
        newMap.set(variant.id, { product, variant });
      }
      
      return newMap;
    });
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    closePicker();
  }, [closePicker]);

  // Handle add
  const handleAdd = useCallback(() => {
    if (selectedVariants.size === 0) {
      closePicker();
      return;
    }

    // Group selected variants by product
    const productMap = new Map();
    selectedVariants.forEach(({ product, variant }) => {
      if (!productMap.has(product.id)) {
        productMap.set(product.id, {
          product,
          variants: []
        });
      }
      productMap.get(product.id).variants.push(variant);
    });

    // Transform to list items
    const newProducts = Array.from(productMap.values()).map(({ product, variants }) => ({
      id: generateId(),
      product: {
        id: product.id,
        title: product.title,
        image: product.image?.src || null
      },
      variants: variants.map(v => ({
        id: v.id,
        title: v.title,
        price: v.price,
        discount: { value: '', type: 'percentage' }
      })),
      discount: { value: '', type: 'percentage' },
      showVariants: false
    }));

    replaceProduct(editingProductId, newProducts);
  }, [selectedVariants, editingProductId, replaceProduct, closePicker]);

  // Count selected products
  const selectedProductCount = useMemo(() => {
    const productIds = new Set();
    selectedVariants.forEach(({ product }) => {
      productIds.add(product.id);
    });
    return productIds.size;
  }, [selectedVariants]);

  // Get selected variants as a Set for quick lookup
  const selectedVariantIds = useMemo(() => {
    return new Set(selectedVariants.keys());
  }, [selectedVariants]);

  if (!isPickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[580px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Select Products</h3>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search product"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>

        {/* Products List */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          {products.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              No products found
            </div>
          ) : (
            <>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <ProductPickerItem
                    product={product}
                    selectedVariants={selectedVariantIds}
                    onProductToggle={handleProductToggle}
                    onVariantToggle={handleVariantToggle}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-[#008060] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {selectedProductCount} product{selectedProductCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-8 py-2 bg-[#008060] text-white text-sm font-medium rounded hover:bg-[#006e52] transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductPicker.displayName = 'ProductPicker';

export default ProductPicker;

