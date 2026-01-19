import { useState, useEffect } from "react";
import { salesAPI, productAPI } from "../services/api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    buying_price: "",
    selling_price: "",
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const data = await salesAPI.getAll();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get product details to include prices
      const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));
      const saleData = {
        ...formData,
        buying_price: selectedProduct?.buying_price || 0,
        selling_price: selectedProduct?.selling_price || 0,
        quantity: parseFloat(formData.quantity),
      };
      
      await salesAPI.create(saleData);
      setFormData({ product_id: "", quantity: "", buying_price: "", selling_price: "" });
      fetchSales();
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Sales Management</h1>
      
      <div style={styles.formCard}>
        <h3>Record New Sale</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Product</label>
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
                  {product.name} (Stock: {product.stock || "N/A"})
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={styles.input}
              required
              min="1"
            />
          </div>
          
          <button type="submit" style={styles.button}>
            Record Sale
          </button>
        </form>
      </div>

      <div style={styles.listCard}>
        <h3>Recent Sales</h3>
        {sales.length === 0 ? (
          <p>No sales recorded yet</p>
        ) : (
          sales.map(sale => (
            <div key={sale.id} style={styles.saleItem}>
              <div>Product ID: {sale.product_id}</div>
              <div>Quantity: {sale.quantity}</div>
              <div>Total: KSH {sale.selling_price * sale.quantity}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
  },
  formCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
    maxWidth: "500px",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  listCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  saleItem: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },
};

export default Sales;