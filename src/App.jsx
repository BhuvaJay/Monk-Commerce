import { ProductProvider } from './context/ProductContext';
import { ProductList } from './components/ProductList';
import { ProductPicker } from './components/ProductPicker';

function App() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <ProductList />
        </div>
      </div>
      <ProductPicker />
    </ProductProvider>
  );
}

export default App;
