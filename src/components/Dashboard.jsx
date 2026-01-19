import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getData();
      setDashboardData(data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div style={styles.container}>
      <h1>Sales Dashboard</h1>
      
      <div style={styles.grid}>
        {/* Remaining Stock Chart */}
        <div style={styles.card}>
          <h3>Stock Levels</h3>
          <ul style={styles.list}>
            {dashboardData.labels.map((label, index) => (
              <li key={index} style={styles.listItem}>
                <span>{label}:</span>
                <span style={styles.value}>{dashboardData.data[index]} units</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sales Data */}
        <div style={styles.card}>
          <h3>Sales per Product</h3>
          <ul style={styles.list}>
            {dashboardData.sales_labels.map((label, index) => (
              <li key={index} style={styles.listItem}>
                <span>{label}:</span>
                <span style={styles.value}>{dashboardData.sales_data[index]} sold</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Profit Data */}
        <div style={styles.card}>
          <h3>Profit per Product</h3>
          <ul style={styles.list}>
            {dashboardData.donut_label.map((label, index) => (
              <li key={index} style={styles.listItem}>
                <span>{label}:</span>
                <span style={styles.profit}>
                  ${dashboardData.donut_data[index]?.toFixed(2) || '0.00'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={loadDashboardData} style={styles.refreshBtn}>
        Refresh Data
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  value: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  profit: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  refreshBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Dashboard;