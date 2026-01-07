import { memo, useCallback, useMemo } from 'react';

const ProductPickerItem = memo(({ 
  product, 
  selectedVariants,
  onProductToggle,
  onVariantToggle 
}) => {
  // Check if all variants are selected
  const allVariantsSelected = useMemo(() => {
    return product.variants.every(v => selectedVariants.has(v.id));
  }, [product.variants, selectedVariants]);

  // Check if some variants are selected
  const someVariantsSelected = useMemo(() => {
    return product.variants.some(v => selectedVariants.has(v.id));
  }, [product.variants, selectedVariants]);

  const handleProductChange = useCallback(() => {
    onProductToggle(product);
  }, [product, onProductToggle]);

  const handleVariantChange = useCallback((variant) => {
    onVariantToggle(product, variant);
  }, [product, onVariantToggle]);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Product Row */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={allVariantsSelected}
            ref={(el) => {
              if (el) {
                el.indeterminate = someVariantsSelected && !allVariantsSelected;
              }
            }}
            onChange={handleProductChange}
            className="w-5 h-5 rounded border-gray-300 text-[#008060] focus:ring-[#008060] cursor-pointer"
          />
        </label>
        
        {/* Product Image */}
        <div className="w-9 h-9 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100">
          {product.image?.src ? (
            <img
              src={product.image.src}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* Product Title */}
        <span className="flex-1 text-sm text-gray-800 truncate">
          {product.title}
        </span>
      </div>

      {/* Variants */}
      <div className="bg-white">
        {product.variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center gap-3 px-4 py-2.5 pl-14 hover:bg-gray-50 border-t border-gray-100"
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedVariants.has(variant.id)}
                onChange={() => handleVariantChange(variant)}
                className="w-5 h-5 rounded border-gray-300 text-[#008060] focus:ring-[#008060] cursor-pointer"
              />
            </label>
            
            {/* Variant Title */}
            <span className="flex-1 text-sm text-gray-700">
              {variant.title}
            </span>

            {/* Availability */}
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {Math.floor(Math.random() * 100) + 1} available
            </span>

            {/* Price */}
            <span className="text-sm text-gray-700 w-16 text-right">
              ${variant.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

ProductPickerItem.displayName = 'ProductPickerItem';

export default ProductPickerItem;

