import { memo, useCallback } from 'react';
import { ChevronDownIcon } from '../icons';

const DiscountInput = memo(({ 
  discount, 
  onDiscountChange, 
  showDiscountButton = false,
  onAddDiscount 
}) => {
  const handleValueChange = useCallback((e) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onDiscountChange({ value });
    }
  }, [onDiscountChange]);

  const handleTypeChange = useCallback((e) => {
    onDiscountChange({ type: e.target.value });
  }, [onDiscountChange]);

  if (showDiscountButton) {
    return (
      <button
        onClick={onAddDiscount}
        className="px-4 py-2 bg-[#008060] text-white text-sm font-medium rounded hover:bg-[#006e52] transition-colors whitespace-nowrap"
      >
        Add Discount
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={discount.value}
        onChange={handleValueChange}
        placeholder=""
        className="w-[70px] px-3 py-2 text-sm border border-gray-200 rounded shadow-sm focus:border-gray-300 focus:ring-0 text-center"
      />
      <div className="relative">
        <select
          value={discount.type}
          onChange={handleTypeChange}
          className="appearance-none w-[90px] px-3 py-2 pr-8 text-sm border border-gray-200 rounded shadow-sm bg-white focus:border-gray-300 focus:ring-0 cursor-pointer"
        >
          <option value="percentage">% Off</option>
          <option value="flat">flat Off</option>
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
});

DiscountInput.displayName = 'DiscountInput';

export default DiscountInput;

