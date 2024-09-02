import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// within 2 minutes, try 24 times after every 5 seconds
const pingServer = async () => {
    for (let i = 0; i < 24; i++) {
        try {
            const { data } = await API.get("/pingServer");
            return data;
        } catch (error) {
            console.clear();
        }
        await delay(5000);
    }
};

export const checkServerAvailibility = async () => {
    return await pingServer();
};

export const executeCode = async ({ LanguageChoice, Program, Input }) => {
    try {
        const { data } = await API.post("/executeCode", { LanguageChoice, Program, Input });
        return data;
    } catch (error) {
        return { message: "Server is down. Please try again later.", error: true }
    }
};