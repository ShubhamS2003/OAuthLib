import React from "react";

function Login() {
    const handleLogin = async () => {
        console.log("Initiating Login");

        try {
            const response = await fetch("http://localhost:5000/api/oauth/login")
            const data = await response.json();
            console.log(data.authUrl)

            if(data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                console.error("Failed to get OAuth URL: ", data);
            }
        } catch (error) {
            console.error("OAuth login error ", error);
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to OAuth Client</h1>
            <p style={styles.subtitle}>Securely authenticate using OAuth 2.0</p>
            <button onClick={handleLogin} style={styles.button}>Login with OAuth</button>
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
        width: "100vw",  // ✅ Ensures full width
        textAlign: "center",  // ✅ Ensures text is centered
        background: "#f4f4f4",
    },
    title: {
        fontSize: "2rem",
        color: "#333",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "1.2rem",
        color: "#666",
        marginBottom: "20px",
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


export default Login;