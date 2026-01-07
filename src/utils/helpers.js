/**
 * Generates a unique ID
 * @returns {string} - Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates an empty product item for the list
 * @param {number} index - Index position
 * @returns {Object} - Empty product item
 */
export const createEmptyProductItem = (index) => ({
  id: generateId(),
  index,
  product: null,
  variants: [],
  discount: {
    value: '',
    type: 'percentage' // 'percentage' or 'flat'
  },
  showVariants: false
});

/**
 * Transforms API product data to list item format
 * @param {Object} product - Product from API
 * @param {Array} selectedVariantIds - Array of selected variant IDs
 * @returns {Object} - Transformed product item
 */
export const transformProductToListItem = (product, selectedVariantIds = []) => {
  const selectedVariants = product.variants.filter(v => 
    selectedVariantIds.includes(v.id)
  );

  return {
    id: generateId(),
    product: {
      id: product.id,
      title: product.title,
      image: product.image?.src || null
    },
    variants: selectedVariants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      discount: {
        value: '',
        type: 'percentage'
      }
    })),
    discount: {
      value: '',
      type: 'percentage'
    },
    showVariants: false
  };
};

/**
 * Moves an item in an array from one index to another
 * @param {Array} array - The array to modify
 * @param {number} from - Source index
 * @param {number} to - Destination index
 * @returns {Array} - New array with moved item
 */
export const arrayMove = (array, from, to) => {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
};

