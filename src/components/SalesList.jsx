import { useState, useEffect } from 'react';
import { saleService } from '../services/api';
import { productService } from '../services/api';

function SalesList() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salesData, productsData] = await Promise.all([
        saleService.getAll(),
        productService.getAll()
      ]);
      setSales(salesData);
      setProducts(productsData);
      setError('');
    } catch (err) {
      setError('Failed to load sales data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const calculateTotal = (sale) => {
    return (sale.selling_price * sale.quantity).toFixed(2);
  };

  const calculateProfit = (sale) => {
    return ((sale.selling_price - sale.buying_price) * sale.quantity).toFixed(2);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await saleService.delete(id);
        loadData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete sale');
      }
    }
  };

  if (loading) return <div>Loading sales...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Sales History</h2>
      
      {sales.length === 0 ? (
        <div style={styles.noData}>No sales recorded yet</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit Price</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Profit</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} style={styles.tr}>
                <td style={styles.td}>{sale.id}</td>
                <td style={styles.td}>{getProductName(sale.product_id)}</td>
                <td style={styles.td}>{sale.quantity}</td>
                <td style={styles.td}>KSH{sale.selling_price}</td>
                <td style={styles.td}>KSH{calculateTotal(sale)}</td>
                <td style={styles.td}>
                  <span style={styles.profit}>KSH{calculateProfit(sale)}</span>
                </td>
                <td style={styles.td}>
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button 
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(sale.id)}
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
        <div>Total Sales: {sales.length} transactions</div>
        <div>Total Quantity Sold: {sales.reduce((sum, sale) => sum + sale.quantity, 0)} units</div>
        <div>Total Revenue: KSH{sales.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity), 0).toFixed(2)}</div>
        <div>Total Profit: KSH{sales.reduce((sum, sale) => sum + ((sale.selling_price - sale.buying_price) * sale.quantity), 0).toFixed(2)}</div>
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
  profit: {
    color: '#28a745',
    fontWeight: 'bold',
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
};

export default SalesList;