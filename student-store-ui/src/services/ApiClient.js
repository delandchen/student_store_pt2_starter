import axios from "axios";

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl;
        this.token = null;
        this.tokenName = "lifetracker_token";
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem(this.tokenName, this.token);
        console.log(token)
    }

    async request({endpoint, method = "GET", data = {}}) {
        const url = `${this.remoteHostUrl}/${endpoint}`;

        const headers = {
            "Accept":"application/json, text/plain, /",
            "Content-Type": "application/json"
        }


        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        try {
            const res = await axios({url, method, data, headers});
            return {data: res.data, error: null};
        }
        catch (err) {
            console.error({ errorResponse: err.response });
            const message = err?.response?.data?.error?.message;
            return {data: null, err: message || String(err)}
        }
    }

    async loginUser(credentials) {
        return await this.request({endpoint: 'auth/login', method:'POST', data: credentials});
    }

    async signUpUser(credentials) {
        return await this.request({endpoint: 'auth/register', method: 'POST', data: credentials});
    }

    async fetchUserFromToken() {
        return await this.request({endpoint: "auth/me", method:"GET" });
    }

    async createOrder(cart) {
        return await this.request({endpoint: "orders", method: "POST", data: cart})
    }

    async logoutUser() {
        this.setToken(null);
        localStorage.removeItem(this.tokenName);
    }
}

export default new ApiClient("http://localhost:3001");