import axios from "axios";

const backend = axios.create({
  baseURL: "http://localhost:8080", //import.meta.env.BACKEND_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default backend;
