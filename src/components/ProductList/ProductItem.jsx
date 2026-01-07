import { memo, useCallback, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { DragHandleIcon, EditIcon, CloseIcon, ChevronDownIcon, ChevronUpIcon } from '../icons';
import DiscountInput from './DiscountInput';
import VariantItem from './VariantItem';
import { useProductContext } from '../../context/ProductContext';

const ProductItem = memo(({ 
  item, 
  index, 
  canRemove = true 
}) => {
  const {
    removeProduct,
    toggleVariants,
    updateProductDiscount,
    updateVariantDiscount,
    reorderVariants,
    removeVariant,
    openPicker
  } = useProductContext();

  const [showDiscount, setShowDiscount] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto'
  };

  // Sensors for variant drag and drop
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

  const handleEdit = useCallback(() => {
    openPicker(item.id);
  }, [item.id, openPicker]);

  const handleRemove = useCallback(() => {
    removeProduct(item.id);
  }, [item.id, removeProduct]);

  const handleToggleVariants = useCallback(() => {
    toggleVariants(item.id);
  }, [item.id, toggleVariants]);

  const handleProductDiscountChange = useCallback((discount) => {
    updateProductDiscount(item.id, discount);
  }, [item.id, updateProductDiscount]);

  const handleVariantDiscountChange = useCallback((productId, variantId, discount) => {
    updateVariantDiscount(productId, variantId, discount);
  }, [updateVariantDiscount]);

  const handleRemoveVariant = useCallback((productId, variantId) => {
    removeVariant(productId, variantId);
  }, [removeVariant]);

  const handleAddDiscount = useCallback(() => {
    setShowDiscount(true);
  }, []);

  const handleVariantDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = item.variants.findIndex(v => v.id === active.id);
      const newIndex = item.variants.findIndex(v => v.id === over.id);
      reorderVariants(item.id, oldIndex, newIndex);
    }
  }, [item.id, item.variants, reorderVariants]);

  const hasMultipleVariants = item.variants.length > 1;
  const isEmptyProduct = !item.product;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white"
    >
      {/* Main Product Row */}
      <div className="flex items-center gap-2 py-2 pl-2 pr-1">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <DragHandleIcon className="w-5 h-5" />
        </div>

        {/* Index */}
        <span className="text-sm text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>

        {/* Product Input/Display */}
        <div className="flex-1 min-w-0 max-w-[260px]">
          <button 
            type="button"
            className="w-full flex items-center justify-between px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm cursor-pointer hover:border-gray-400 transition-colors text-left"
            onClick={handleEdit}
          >
            <span className="text-sm text-gray-700 truncate">
              {isEmptyProduct ? 'Select Product' : item.product.title}
            </span>
            <EditIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
          </button>
        </div>

        {/* Discount Section */}
        {!isEmptyProduct && (
          <DiscountInput
            discount={item.discount}
            onDiscountChange={handleProductDiscountChange}
            showDiscountButton={!showDiscount && item.discount.value === ''}
            onAddDiscount={handleAddDiscount}
          />
        )}

        {/* Remove Button */}
        {canRemove && (
          <button
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Remove product"
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Show/Hide Variants Toggle */}
      {!isEmptyProduct && hasMultipleVariants && (
        <div className="flex justify-end pr-6 pb-1">
          <button
            onClick={handleToggleVariants}
            className="flex items-center gap-1 text-sm text-[#006e52] hover:text-[#005a44] transition-colors underline decoration-[#006e52]"
          >
            {item.showVariants ? 'Hide variants' : 'Show variants'}
            {item.showVariants ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </button>
        </div>
      )}

      {/* Variants List */}
      {!isEmptyProduct && item.showVariants && item.variants.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleVariantDragEnd}
        >
          <SortableContext
            items={item.variants.map(v => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="border-t border-gray-100">
              {item.variants.map((variant) => (
                <VariantItem
                  key={variant.id}
                  variant={variant}
                  productId={item.id}
                  onDiscountChange={handleVariantDiscountChange}
                  onRemove={handleRemoveVariant}
                  canRemove={item.variants.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
});

ProductItem.displayName = 'ProductItem';

export default ProductItem;

