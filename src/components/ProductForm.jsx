import { useState } from 'react';
import { productAPI } from '../services/api';

function ProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    buying_price: "",
    selling_price: "",
    quantity: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await productAPI.create({
        ...formData,
        buying_price: parseFloat(formData.buying_price),
        selling_price: parseFloat(formData.selling_price),
        quantity: formData.quantity === "" ? 0 : parseInt(formData.quantity)
      });
      
      // Reset form
      setFormData({
        name: "",
        buying_price: "",
        selling_price: "",
        quantity: ""
      });
      
      if (onSuccess) onSuccess();
      
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Product</h2>
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

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

        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <button 
          type="submit" 
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
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
    gap: '35px',
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
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
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
};

export default ProductForm;