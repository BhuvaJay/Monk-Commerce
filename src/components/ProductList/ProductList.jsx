import { memo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useProductContext } from '../../context/ProductContext';
import ProductItem from './ProductItem';

const ProductList = memo(() => {
  const { products, reorderProducts, addProduct } = useProductContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = products.findIndex(p => p.id === active.id);
      const newIndex = products.findIndex(p => p.id === over.id);
      reorderProducts(oldIndex, newIndex);
    }
  }, [products, reorderProducts]);

  const canRemoveProducts = products.length > 1;

  return (
    <div className="w-full max-w-[580px]">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Products</h2>

      {/* Column Headers */}
      {products.length > 0 && (
        <div className="flex items-center mb-2 pl-2">
          <div className="w-7" /> {/* Drag handle space */}
          <div className="w-8" /> {/* Index space */}
          <span className="flex-1 text-sm font-medium text-gray-600">Product</span>
          <span className="text-sm font-medium text-gray-600 w-[200px] text-center">Discount</span>
        </div>
      )}

      {/* Product List */}
      {products.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1 mb-4">
              {products.map((item, index) => (
                <ProductItem
                  key={item.id}
                  item={item}
                  index={index}
                  canRemove={canRemoveProducts}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Product Button */}
      <div className="flex justify-end mt-4 pr-4">
        <button
          onClick={addProduct}
          className="px-12 py-2 border-2 border-[#008060] text-[#008060] text-sm font-medium rounded hover:bg-[#008060] hover:text-white transition-colors"
        >
          Add Product
        </button>
      </div>
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;

