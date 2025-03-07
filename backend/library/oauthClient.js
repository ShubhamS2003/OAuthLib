import axios from "axios";

class OAuth_Client {
    constructor({ clientId, clientSecret, authUrl, tokenUrl, redirectUri, scope }) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.authUrl = authUrl;
        this.tokenUrl = tokenUrl;
        this.redirectUri = redirectUri;
        this.scope = scope;
    }

    initiateLogin() {
        const url = `${this.authUrl}?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&scope=${encodeURIComponent(this.scope)}`;
        return url;
    }



    async handleCallback(authCode) {
        if (!authCode) throw new Error("Authorization code not found!");

        try {
            const response = await axios.post(this.tokenUrl, new URLSearchParams({
                grant_type: "authorization_code",
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: authCode,
                redirect_uri: this.redirectUri
            }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            return response.data;
        } catch (error) {
            console.error("OAuth Error:", error.response?.data || error.message);
            throw error;
        }
    }

    async refreshToken(refresh_token) {
        if (!refresh_token) throw new Error("Refresh token not found");

        try {
            const response = await axios.post(this.tokenUrl, new URLSearchParams({
                grant_type: "refresh_token",
                client_id: this.clientId,
                refreshToken: refresh_token
            }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            return response.data;
        } catch (error) {
            console.error("OAuth error:", error.response?.data || error.message);
            throw error;
        }
    }

    async getUserInfo(email, accessToken) {
        if (!email || !accessToken) throw new Error("Email or access token missing");
    
        try {
            const response = await axios.get("https://dev-galagx8elg75r1ab.us.auth0.com/api/v2/users", {
                params: {
                    q: `email:"${email}"`,
                    search_engine: "v3"
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            return response.data;
        } catch (error) {
            console.error("Auth0 API error:", error.response?.data || error.message);
            throw error;
        }
    }

}

export default OAuth_Client
