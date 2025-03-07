import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import {jwtDecode} from "jwt-decode";
import OAuth_Client from "./library/oauthClient.js";
import dotenv from "dotenv";

dotenv.config();

const oauthClient = new OAuth_Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authUrl: process.env.AUTH_URL,
    tokenUrl: process.env.TOKEN_URL,
    redirectUri: process.env.REDIRECT_URI,
    scope: process.env.SCOPE
})

const app = express();
app.use(cors({ origin: process.env.FE_URL, credentials:true }));
app.use(cookieParser());
app.use(express.json()); 

// Start the OAuth flow
app.get("/api/oauth/login", async(req, res) => {
    try {
        const authUrl = oauthClient.initiateLogin();
        res.json({ authUrl });
    } catch (error) {
        console.error("Error generating OAuth URL: ", error);
        res.status(500).json({ error: "Failed to generate URL"});
    }
})


// Send the authorization code to fetch the tokens
app.post("/api/oauth/callback", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: "Authorization code is required" });
        }

        const tokens = await oauthClient.handleCallback(code);

        if (!tokens || !tokens.id_token) {
            return res.status(401).json({ success: false, error: "Failed to retrieve tokens" });
        }

        res.cookie("access_token", tokens.access_token, { httpOnly: true, secure: true, sameSite: "None" });
        res.cookie("refresh_token", tokens.refresh_token, { httpOnly: true, secure: true, sameSite: "None" });
        res.cookie("id_token", tokens.id_token, { httpOnly: true, secure: true, sameSite: "None" });

        return res.json({ success: true });
    } catch (error) {
        console.error("OAuth Callback Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Fetch the user information
app.get("/api/getUsers", async (req, res) => {
    const idToken = await req.cookies.id_token;
    
    // TODO: Figure out a way to track the access token expiry and call refreshToken() to get a new one.
    // if(accessToken.expired()){
    //     accessToken = await oauthClient.refreshToken(refreshToken); 
    // }
    // For now we are decoding the id_token to access the user data

    if(!idToken) return res.status(401).json({message: "Not authenticated"});

    try {
        const userInfo = jwtDecode(idToken);
        res.json({user_info: userInfo});
    } catch (error) {
        console.error("Error decoding user details: ", error);
        res.status(401).json({ message: "Invalid token"})
    }
})


// Protected API endpoint
app.get("/dashboard", async (req, res) => {
    const accessToken = await req.cookies.access_token;
    
    if (!accessToken) {
        return res.status(401).json({message: "You are not authorized"});
    }

    try {
        res.json({message: "Welcome! You are authorized"});
    } catch (error) {
        console.error("User Info Error:", error);
        res.redirect("/api/oauth/login");
    }
});


// Logs out the user by clearing cookies
app.post("/api/logout", (req, res) => {
    try {
        res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "None" });
        res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "None" });
        res.clearCookie("id_token", { httpOnly: true, secure: true, sameSite: "None" });

        return res.status(200).json({ success: true, message: "Cookies cleared, user logged out." });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ success: false, error: "Failed to log out." });
    }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
