import { useState, useEffect } from 'react';
import { productAPI, purchasesAPI } from '../services/api';
import { productApi } from '../services/api';

function PurchasesList() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [purchasesData, productsData] = await Promise.all([
        purchasesAPI.getAll(),
        productAPI.getAll()
      ]);
      setPurchases(purchasesData);
      setProducts(productsData);
      setError('');
    } catch (err) {
      setError('Failed to load purchases data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await purchasesAPI.delete(id);
        loadData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete purchase');
      }
    }
  };

  if (loading) return <div>Loading purchases...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Purchase History</h2>
      
      {purchases.length === 0 ? (
        <div style={styles.noData}>No purchases recorded yet</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.id} style={styles.tr}>
                <td style={styles.td}>{purchase.id}</td>
                <td style={styles.td}>{getProductName(purchase.product_id)}</td>
                <td style={styles.td}>
                  <span style={styles.quantity}>{purchase.quantity} units</span>
                </td>
                <td style={styles.td}>
                  {new Date(purchase.date).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button 
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(purchase.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div style={styles.summary}>
        <h3>Summary</h3>
        <div>Total Purchases: {purchases.length} transactions</div>
        <div>Total Quantity Purchased: {purchases.reduce((sum, purchase) => sum + purchase.quantity, 0)} units</div>
        <div>Unique Products: {[...new Set(purchases.map(p => p.product_id))].length}</div>
        
        <h4 style={{ marginTop: '15px' }}>Purchases by Product:</h4>
        <ul style={styles.productList}>
          {products.map(product => {
            const productPurchases = purchases.filter(p => p.product_id === product.id);
            const totalQuantity = productPurchases.reduce((sum, p) => sum + p.quantity, 0);
            
            if (totalQuantity > 0) {
              return (
                <li key={product.id} style={styles.productListItem}>
                  <span>{product.name}:</span>
                  <span style={styles.productQuantity}>{totalQuantity} units</span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
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
  quantity: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '18px',
  },
  summary: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  productList: {
    listStyle: 'none',
    padding: '0',
    marginTop: '10px',
  },
  productListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px solid #eee',
  },
  productQuantity: {
    fontWeight: 'bold',
    color: '#28a745',
  },
};

export default PurchasesList;