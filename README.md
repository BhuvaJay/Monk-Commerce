# Monk Commerce Product List

A React-based e-commerce product list management application that allows store owners to create and manage a list of products with variants and discounts.

## Features

### 1. Product List
- Display a list of products with their variants
- Add/remove products from the list
- **Drag and drop** to reorder products and variants
- Show/Hide variants toggle (only for products with multiple variants)
- Individual discounts for products and variants (percentage or flat)

### 2. Product Picker
- Modal dialog to select products from the store
- **Search with debouncing** (300ms delay for API optimization)
- Multi-select products and variants
- Infinite scroll pagination (10 products per page)
- Replace functionality - selected products replace the clicked item

### 3. Discount System
- Add Discount button for products
- Individual variant discounts
- Choose between percentage (% Off) and flat discount types

## Tech Stack

- **React** (v19) - UI Framework
- **Vite** (v5) - Build Tool
- **Tailwind CSS** (v3) - Styling
- **@dnd-kit** - Drag and Drop functionality
- **React Context** - State Management

## Project Structure

```
src/
├── components/
│   ├── icons/           # SVG icon components
│   ├── ProductList/     # Product list components
│   │   ├── ProductList.jsx
│   │   ├── ProductItem.jsx
│   │   ├── VariantItem.jsx
│   │   └── DiscountInput.jsx
│   └── ProductPicker/   # Product picker modal
│       ├── ProductPicker.jsx
│       └── ProductPickerItem.jsx
├── context/
│   └── ProductContext.jsx  # Global state management
├── hooks/
│   ├── useDebounce.js      # Debounce hook for search
│   └── useInfiniteScroll.js # Infinite scroll hook
├── services/
│   └── api.js              # API service with fallback
├── data/
│   └── sampleProducts.js   # Sample product data
├── utils/
│   └── helpers.js          # Utility functions
├── App.jsx
├── main.jsx
└── index.css
```

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd monk-commerce

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://stageapi.monkcommerce.app/task/products/search
VITE_API_KEY=your_api_key_here
```

If the API key is not provided or the API fails, the application will use sample product data.

## API Integration

The application integrates with the Monk Commerce API:

- **Endpoint**: `https://stageapi.monkcommerce.app/task/products/search`
- **Method**: GET
- **Query Parameters**:
  - `search`: Search query string
  - `page`: Page number (0-indexed)
  - `limit`: Products per page
- **Headers**: `x-api-key: <your-api-key>`

## Optimization Techniques

1. **React.memo** - Prevents unnecessary re-renders of components
2. **useCallback** - Memoizes callback functions
3. **useMemo** - Memoizes computed values
4. **Debouncing** - Search input is debounced to reduce API calls
5. **Infinite Scroll** - Uses Intersection Observer for efficient pagination
6. **Context Optimization** - Actions are memoized to prevent re-renders

## Usage

1. Click **"Add Product"** to add an empty product slot
2. Click on **"Select Product"** to open the product picker
3. Search for products using the search bar
4. Select products and variants using checkboxes
5. Click **"Add"** to add selected products
6. Use **drag handles** to reorder products/variants
7. Click **"Add Discount"** or use discount inputs for pricing
8. Use **"Show/Hide variants"** to expand variant details
9. Click **X** to remove products or variants

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

