import { useState, useEffect } from "react";
import { productAPI } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    buying_price: "",
    selling_price: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
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
      if (editingId) {
        // Update existing product
        await productAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        // Create new product
        await productAPI.create(formData);
      }
      
      // Reset form and refresh products
      setFormData({ name: "", buying_price: "", selling_price: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      buying_price: product.buying_price,
      selling_price: product.selling_price,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", buying_price: "", selling_price: "" });
  };

  if (loading) return <div style={styles.loading}>Loading products...</div>;

  return (
    <div style={styles.container}>
      <h1>Products Management</h1>
      
      {/* Product Form */}
      <div style={styles.formCard}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="number"
              name="buying_price"
              placeholder="Buying Price"
              value={formData.buying_price}
              onChange={handleChange}
              style={styles.input}
              required
              step="0.01"
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="number"
              name="selling_price"
              placeholder="Selling Price"
              value={formData.selling_price}
              onChange={handleChange}
              style={styles.input}
              required
              step="0.01"
            />
          </div>
          
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              {editingId ? "Update" : "Add"} Product
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div style={styles.productsList}>
        <h3>Products List ({products.length})</h3>
        
        {products.length === 0 ? (
          <p style={styles.noData}>No products found. Add your first product!</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Buying Price</th>
                  <th style={styles.th}>Selling Price</th>
                  <th style={styles.th}>Profit</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={styles.tr}>
                    <td style={styles.td}>{product.name}</td>
                    <td style={styles.td}>KSH {product.buying_price}</td>
                    <td style={styles.td}>KSH {product.selling_price}</td>
                    <td style={styles.td}>
                      KSH {(product.selling_price - product.buying_price).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  formCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
    maxWidth: "500px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
  },
  submitButton: {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  cancelButton: {
    padding: "0.75rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  productsList: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  noData: {
    textAlign: "center",
    padding: "2rem",
    color: "#6c757d",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
  },
  tr: {
    borderBottom: "1px solid #dee2e6",
  },
  td: {
    padding: "1rem",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "0.5rem",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Products;