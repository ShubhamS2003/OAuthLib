import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
    const hasRun = useRef(false);
    const navigate = useNavigate();
    useEffect(() => {
        const processAuthCode = async () => {

            if (hasRun.current) return; 
            hasRun.current = true;

            if (window.location.search.includes("code=")) {
                const codeQuery = window.location.search;
                const codeString = new URLSearchParams(codeQuery);
                const authCode = codeString.get("code");
                console.log(authCode);

                try {
                    const response = await fetch("http://localhost:5000/api/oauth/callback", {
                        method: "POST",
                        body: JSON.stringify({ code: authCode }),
                        credentials: 'include',
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await response.json();
                    console.log("Token Response:", data);

                    if (data.error) {
                        console.error("OAuth Error:", data.error);
                    } else {
                        console.log("Authentication Successful:", data);
                        localStorage.setItem("isAuthenticated", "true");
                        navigate("/user_info");
                    }
                } catch (error) {
                    console.error("OAuth Callback Error:", error);
                }
            }
        }
        processAuthCode();
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Processing authentication...</h2>
        </div>
    );
}

export default Callback;