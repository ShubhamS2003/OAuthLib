import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getUsers", {
                    method: "GET",
                    credentials: "include" 
                });

                const data = await response.json();

                if (response.ok) {
                    setUser(data.user_info);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to fetch user data");
            }
        };

        fetchUserData();
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>User Profile</h2>
            {error ? (
                <p style={styles.error}>{error}</p>
            ) : user ? (
                <div style={styles.profileCard}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            ) : (
                <p style={styles.loading}>Loading user data...</p>
            )}
            <button onClick={() => navigate("/dashboard")} style={styles.button}>
                Go to Dashboard
            </button>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "#f4f4f4",
        textAlign: "center",
        color: "#333", // ✅ Ensures readable text
    },
    heading: {
        fontSize: "2rem",
        color: "#222", // ✅ Dark text for visibility
        marginBottom: "20px",
    },
    error: {
        color: "red",
        fontSize: "1.2rem",
    },
    loading: {
        fontSize: "1.2rem",
        color: "#555", // ✅ Slightly darker for contrast
    },
    profileCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        minWidth: "300px",
        marginBottom: "20px",
    },
    text: {
        color: "#333", // ✅ Ensures all text inside the card is visible
        fontSize: "1rem",
    },
    button: {
        padding: "12px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background 0.3s",
    },
};

export default UserProfile;
