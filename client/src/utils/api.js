import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// within 2 minutes, try 24 times after every 5 seconds
const pingServer = async () => {
    for (let i = 0; i < 24; i++) {
        try {
            const { data } = await API.get("/pingServer");
            return true;
        } catch (error) {
            console.clear();
        }
        await delay(5000);
    }
};

export const checkServerAvailibility = async () => {
    return await pingServer();
}