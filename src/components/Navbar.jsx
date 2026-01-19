import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Sales Management</div>
      
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/sales" style={styles.link}>Sales</Link>
        <Link to="/purchases" style={styles.link}>Purchases</Link>
      </div>

      <div style={styles.userSection}>
        {user.email ? (
          <>
            <span style={styles.welcome}>Welcome, {user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#333",
    color: "white",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  welcome: {
    color: "#ccc",
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;