import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [message, setMessage] = useState("Loading...");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/dashboard", {
                    method: "GET",
                    credentials: "include",
                });

                // console.log(response);

                const data = await response.json();
                // console.log(data);

                if (response.ok) {
                    setMessage(data.message);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                if (error.response?.status === 401) {
                    setMessage("You are not authorized");
                } else {
                    setMessage("Something went wrong. Please try again.");
                }
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/oauth/logout", {
                method: "POST",
                credentials: "include",
            });
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.message}>{message}</p>
            <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "#ffffff",
        textAlign: "center",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#222222",
        marginBottom: "20px",
    },
    message: {
        fontSize: "1.2rem",
        fontWeight: "500",
        color: "#333333",
    },
    logoutButton: {
        marginTop: "20px",
        padding: "10px 15px",
        fontSize: "16px",
        background: "#d9534f", // Red button for logout
        color: "#fff",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        transition: "background 0.3s ease",
    },
};

export default Dashboard;
