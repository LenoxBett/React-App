import React, { useState } from 'react';
import PurchasesList from '../components/PurchasesList';
import PurchasesForm from '../components/PurchasesForm';

function Purchases() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePurchaseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={styles.container}>
      <h1>Purchases Management</h1>
      
      <div style={styles.content}>
        <div style={styles.formSection}>
          <PurchasesForm onSuccess={handlePurchaseAdded} />
        </div>
        
        <div style={styles.listSection}>
          <PurchasesList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  content: {
    display: 'flex',
    gap: '40px',
    marginTop: '20px',
  },
  formSection: {
    flex: 1,
  },
  listSection: {
    flex: 2,
  },
};

export default Purchases;