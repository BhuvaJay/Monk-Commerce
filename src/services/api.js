import { sampleProducts } from '../data/sampleProducts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stageapi.monkcommerce.app/task/products/search';
const API_KEY = import.meta.env.VITE_API_KEY || '72njgfa948d9aS7gs5';

/**
 * Fetches products from the API with fallback to sample data
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query string
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.limit - Number of products per page
 * @returns {Promise<{products: Array, hasMore: boolean}>}
 */
export const fetchProducts = async ({ search = '', page = 0, limit = 10 }) => {
  try {
    // Only attempt API call if we have an API key
    if (API_KEY && API_KEY !== 'your_api_key_here') {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      return {
        products: data,
        hasMore: data.length === limit
      };
    }

    // Fallback to sample data
    return getFilteredSampleProducts({ search, page, limit });
  } catch (error) {
    console.warn('API call failed, using sample data:', error.message);
    return getFilteredSampleProducts({ search, page, limit });
  }
};

/**
 * Filters and paginates sample products for offline/fallback use
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query string
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.limit - Number of products per page
 * @returns {{products: Array, hasMore: boolean}}
 */
const getFilteredSampleProducts = ({ search = '', page = 0, limit = 10 }) => {
  // Filter products by search term
  const filteredProducts = search
    ? sampleProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase())
      )
    : sampleProducts;

  // Calculate pagination
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    hasMore: endIndex < filteredProducts.length
  };
};

