import { memo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleIcon, CloseIcon } from '../icons';
import DiscountInput from './DiscountInput';

const VariantItem = memo(({ 
  variant, 
  productId,
  onDiscountChange,
  onRemove,
  canRemove = true
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: variant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto'
  };

  const handleDiscountChange = useCallback((discount) => {
    onDiscountChange(productId, variant.id, discount);
  }, [productId, variant.id, onDiscountChange]);

  const handleRemove = useCallback(() => {
    onRemove(productId, variant.id);
  }, [productId, variant.id, onRemove]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-2 pl-14 pr-1 bg-white border-t border-gray-100"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
      >
        <DragHandleIcon className="w-5 h-5" />
      </div>

      {/* Variant Title */}
      <div className="flex-1 min-w-0 max-w-[180px]">
        <div className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-sm text-gray-700 truncate">
          {variant.title}
        </div>
      </div>

      {/* Discount Input */}
      <DiscountInput
        discount={variant.discount}
        onDiscountChange={handleDiscountChange}
      />

      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={handleRemove}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Remove variant"
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
});

VariantItem.displayName = 'VariantItem';

export default VariantItem;

