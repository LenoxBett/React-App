// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardAPI.getData();
      setDashboardData(data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      
      <div style={styles.grid}>
        {/* Stock Summary Card */}
        <div style={styles.card}>
          <h3>Stock Summary</h3>
          {dashboardData?.labels?.map((label, index) => (
            <div key={index} style={styles.summaryItem}>
              <span>{label}: </span>
              <strong>{dashboardData.data?.[index] || 0} units</strong>
            </div>
          ))}
        </div>

        {/* Sales Summary Card */}
        <div style={styles.card}>
          <h3>Sales by Product</h3>
          {dashboardData?.sales_labels?.map((label, index) => (
            <div key={index} style={styles.summaryItem}>
              <span>{label}: </span>
              <strong>{dashboardData.sales_data?.[index] || 0} sold</strong>
            </div>
          ))}
        </div>

        {/* Profit Summary Card */}
        <div style={styles.card}>
          <h3>Profit by Product</h3>
          {dashboardData?.donut_label?.map((label, index) => (
            <div key={index} style={styles.summaryItem}>
              <span>{label}: </span>
              <strong>KSH {dashboardData.donut_data?.[index] || 0}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Charts (using divs as bars) */}
      <div style={styles.chartsSection}>
        <div style={styles.chart}>
          <h3>Stock Levels</h3>
          <div style={styles.barChart}>
            {dashboardData?.labels?.map((label, index) => (
              <div key={index} style={styles.barContainer}>
                <div style={styles.barLabel}>{label}</div>
                <div style={styles.barWrapper}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${Math.min(100, (dashboardData.data?.[index] || 0) * 2)}%`,
                      backgroundColor: "#007bff",
                    }}
                  >
                    <span style={styles.barValue}>
                      {dashboardData.data?.[index] || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
  },
  loading: {
    padding: "2rem",
    textAlign: "center",
  },
  error: {
    padding: "2rem",
    color: "#dc3545",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
  },
  chartsSection: {
    marginTop: "2rem",
  },
  chart: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  barChart: {
    marginTop: "1rem",
  },
  barContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  barLabel: {
    width: "150px",
    fontWeight: "bold",
  },
  barWrapper: {
    flex: 1,
    height: "30px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: "10px",
    transition: "width 0.3s ease",
  },
  barValue: {
    color: "white",
    fontWeight: "bold",
  },
};

export default Dashboard;