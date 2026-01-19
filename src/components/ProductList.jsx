import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        loadProducts(); // Refresh the list
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Products List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Buying Price</th>
            <th style={styles.th}>Selling Price</th>
            <th style={styles.th}>Quantity</th>
            {/* <th style={styles.th}>Profit</th> */}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={styles.tr}>
              <td style={styles.td}>{product.id}</td>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>{product.buying_price}</td>
              <td style={styles.td}>{product.selling_price}</td>
              <td style={styles.td}>{product.quantity}</td>
              {/* <td style={styles.td}>
                {(product.selling_price - product.buying_price).toFixed(2)}
              </td> */}
              <td style={styles.td}>
                <button style={styles.editBtn}>Edit</button>
                <button 
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default ProductList;