import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { generateId, arrayMove } from '../utils/helpers';

// Initial state
const initialState = {
  products: [],
  isPickerOpen: false,
  editingProductId: null
};

// Action types
const ACTIONS = {
  ADD_PRODUCT: 'ADD_PRODUCT',
  REMOVE_PRODUCT: 'REMOVE_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  REPLACE_PRODUCT: 'REPLACE_PRODUCT',
  REORDER_PRODUCTS: 'REORDER_PRODUCTS',
  TOGGLE_VARIANTS: 'TOGGLE_VARIANTS',
  UPDATE_PRODUCT_DISCOUNT: 'UPDATE_PRODUCT_DISCOUNT',
  UPDATE_VARIANT_DISCOUNT: 'UPDATE_VARIANT_DISCOUNT',
  REORDER_VARIANTS: 'REORDER_VARIANTS',
  REMOVE_VARIANT: 'REMOVE_VARIANT',
  OPEN_PICKER: 'OPEN_PICKER',
  CLOSE_PICKER: 'CLOSE_PICKER'
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_PRODUCT: {
      const newProduct = {
        id: generateId(),
        product: null,
        variants: [],
        discount: { value: '', type: 'percentage' },
        showVariants: false
      };
      return {
        ...state,
        products: [...state.products, newProduct]
      };
    }

    case ACTIONS.REMOVE_PRODUCT: {
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload.productId)
      };
    }

    case ACTIONS.REPLACE_PRODUCT: {
      const { productId, newProducts } = action.payload;
      const index = state.products.findIndex(p => p.id === productId);
      if (index === -1) return state;

      const updatedProducts = [...state.products];
      updatedProducts.splice(index, 1, ...newProducts);
      
      return {
        ...state,
        products: updatedProducts,
        isPickerOpen: false,
        editingProductId: null
      };
    }

    case ACTIONS.REORDER_PRODUCTS: {
      const { oldIndex, newIndex } = action.payload;
      return {
        ...state,
        products: arrayMove(state.products, oldIndex, newIndex)
      };
    }

    case ACTIONS.TOGGLE_VARIANTS: {
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.productId
            ? { ...p, showVariants: !p.showVariants }
            : p
        )
      };
    }

    case ACTIONS.UPDATE_PRODUCT_DISCOUNT: {
      const { productId, discount } = action.payload;
      return {
        ...state,
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, discount: { ...p.discount, ...discount } }
            : p
        )
      };
    }

    case ACTIONS.UPDATE_VARIANT_DISCOUNT: {
      const { productId, variantId, discount } = action.payload;
      return {
        ...state,
        products: state.products.map(p =>
          p.id === productId
            ? {
                ...p,
                variants: p.variants.map(v =>
                  v.id === variantId
                    ? { ...v, discount: { ...v.discount, ...discount } }
                    : v
                )
              }
            : p
        )
      };
    }

    case ACTIONS.REORDER_VARIANTS: {
      const { productId, oldIndex, newIndex } = action.payload;
      return {
        ...state,
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, variants: arrayMove(p.variants, oldIndex, newIndex) }
            : p
        )
      };
    }

    case ACTIONS.REMOVE_VARIANT: {
      const { productId, variantId } = action.payload;
      return {
        ...state,
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, variants: p.variants.filter(v => v.id !== variantId) }
            : p
        )
      };
    }

    case ACTIONS.OPEN_PICKER: {
      return {
        ...state,
        isPickerOpen: true,
        editingProductId: action.payload.productId
      };
    }

    case ACTIONS.CLOSE_PICKER: {
      return {
        ...state,
        isPickerOpen: false,
        editingProductId: null
      };
    }

    default:
      return state;
  }
};

// Create context
const ProductContext = createContext(null);

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Memoized actions
  const actions = useMemo(() => ({
    addProduct: () => dispatch({ type: ACTIONS.ADD_PRODUCT }),
    
    removeProduct: (productId) => 
      dispatch({ type: ACTIONS.REMOVE_PRODUCT, payload: { productId } }),
    
    replaceProduct: (productId, newProducts) =>
      dispatch({ type: ACTIONS.REPLACE_PRODUCT, payload: { productId, newProducts } }),
    
    reorderProducts: (oldIndex, newIndex) =>
      dispatch({ type: ACTIONS.REORDER_PRODUCTS, payload: { oldIndex, newIndex } }),
    
    toggleVariants: (productId) =>
      dispatch({ type: ACTIONS.TOGGLE_VARIANTS, payload: { productId } }),
    
    updateProductDiscount: (productId, discount) =>
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DISCOUNT, payload: { productId, discount } }),
    
    updateVariantDiscount: (productId, variantId, discount) =>
      dispatch({ type: ACTIONS.UPDATE_VARIANT_DISCOUNT, payload: { productId, variantId, discount } }),
    
    reorderVariants: (productId, oldIndex, newIndex) =>
      dispatch({ type: ACTIONS.REORDER_VARIANTS, payload: { productId, oldIndex, newIndex } }),
    
    removeVariant: (productId, variantId) =>
      dispatch({ type: ACTIONS.REMOVE_VARIANT, payload: { productId, variantId } }),
    
    openPicker: (productId) =>
      dispatch({ type: ACTIONS.OPEN_PICKER, payload: { productId } }),
    
    closePicker: () =>
      dispatch({ type: ACTIONS.CLOSE_PICKER })
  }), []);

  const value = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

