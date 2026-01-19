import { useState, useEffect } from 'react';
import { purchasesAPI } from '../services/api';
import { productAPI } from '../services/api';

function PurchasesForm({ onSuccess }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    }
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
      await purchasesAPI.create({
        ...formData,
        product_id: parseInt(formData.product_id),
        quantity: parseFloat(formData.quantity)
      });
      
      // Reset form
      setFormData({
        product_id: '',
        quantity: ''
      });
      
      if (onSuccess) onSuccess();
      
    } catch (err) {
      setError('Failed to record purchase. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));

  return (
    <div style={styles.container}>
      <h2>Record New Purchase</h2>
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product:</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
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

        {selectedProduct && (
          <div style={styles.productInfo}>
            <h4>Product Information:</h4>
            <div>Product: {selectedProduct.name}</div>
            <div>Current Buying Price: KSH{selectedProduct.buying_price}</div>
            <div>Current Selling Price: KSH{selectedProduct.selling_price}</div>
            <div>Profit Margin: KSH{(selectedProduct.selling_price - selectedProduct.buying_price).toFixed(2)} per unit</div>
          </div>
        )}

        <div style={styles.notes}>
          <p><strong>Note:</strong> Purchases increase your inventory stock.</p>
          <p>Make sure to record purchases whenever you restock products.</p>
        </div>

        <button 
          type="submit" 
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Recording Purchase...' : 'Record Purchase'}
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
  formGroup: {
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
    backgroundColor: '#007bff',
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
  notes: {
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    border: '1px solid #ffeaa7',
    color: '#856404',
  },
};

export default PurchasesForm;