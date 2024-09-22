import axios from "axios";

const backend = axios.create({
  baseURL: "http://localhost:8080", //import.meta.env.BACKEND_BASE_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: () => true,
});

export default backend;
