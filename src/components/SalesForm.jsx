import { useState, useEffect } from 'react';
import { saleService } from '../services/api';
import { productService } from '../services/api';

function SalesForm({ onSuccess }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    buying_price: '',
    selling_price: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    }
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    
    setFormData({
      ...formData,
      product_id: productId,
      buying_price: product ? product.buying_price : '',
      selling_price: product ? product.selling_price : ''
    });
    setSelectedProduct(product);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await saleService.create({
        ...formData,
        product_id: parseInt(formData.product_id),
        quantity: parseFloat(formData.quantity),
        buying_price: parseFloat(formData.buying_price),
        selling_price: parseFloat(formData.selling_price)
      });
      
      // Reset form
      setFormData({
        product_id: '',
        quantity: '',
        buying_price: '',
        selling_price: ''
      });
      setSelectedProduct(null);
      
      if (onSuccess) onSuccess();
      
    } catch (err) {
      setError('Failed to record sale. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (formData.quantity && formData.selling_price) {
      return (parseFloat(formData.quantity) * parseFloat(formData.selling_price)).toFixed(2);
    }
    return '0.00';
  };

  const calculateProfit = () => {
    if (formData.quantity && formData.buying_price && formData.selling_price) {
      return ((parseFloat(formData.selling_price) - parseFloat(formData.buying_price)) * parseFloat(formData.quantity)).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div style={styles.container}>
      <h2>Record New Sale</h2>
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product:</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleProductChange}
            style={styles.select}
            required
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (Stock: {product.stock || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            min="1"
            step="1"
            required
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Buying Price (KSH):</label>
            <input
              type="number"
              name="buying_price"
              value={formData.buying_price}
              onChange={handleChange}
              style={styles.input}
              step="0.01"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Selling Price (KSH):</label>
            <input
              type="number"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              style={styles.input}
              step="0.01"
              required
            />
          </div>
        </div>

        {selectedProduct && (
          <div style={styles.productInfo}>
            <h4>Product Information:</h4>
            <div>Product: {selectedProduct.name}</div>
            <div>Current Price: KSH{selectedProduct.selling_price}</div>
            <div>Profit Margin: KSH{(selectedProduct.selling_price - selectedProduct.buying_price).toFixed(2)} per unit</div>
          </div>
        )}

        <div style={styles.calculations}>
          <div style={styles.calcRow}>
            <span>Total Amount:</span>
            <span style={styles.calcValue}>KSH{calculateTotal()}</span>
          </div>
          <div style={styles.calcRow}>
            <span>Estimated Profit:</span>
            <span style={styles.profitValue}>KSH{calculateProfit()}</span>
          </div>
        </div>

        <button 
          type="submit" 
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Recording Sale...' : 'Record Sale'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    backgroundColor: '#f8d7da',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
  },
  productInfo: {
    padding: '15px',
    backgroundColor: '#e9f7fe',
    borderRadius: '6px',
    border: '1px solid #b3e0ff',
  },
  calculations: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #dee2e6',
  },
  calcRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '16px',
  },
  calcValue: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  profitValue: {
    fontWeight: 'bold',
    color: '#28a745',
  },
};

export default SalesForm;