// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  // Abhi Render backend use kar rahe ho
  baseURL: "https://shopsphere-backend-vo3y.onrender.com/api",
  // Agar kabhi local pe test karna ho:
  // baseURL: "http://localhost:5000/api",
});

// Har request se pehle token header me lagane ke liye interceptor
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem("user");
      console.log("INTERCEPTOR raw userInfo:", userInfo);

      if (userInfo) {
        const user = JSON.parse(userInfo);
        console.log("INTERCEPTOR parsed user:", user);

        // IMPORTANT: user.token exist hona chahiye
        if (user && user.token) {
          if (!config.headers) config.headers = {};
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log(
            "INTERCEPTOR set header:",
            config.headers.Authorization
          );
        } else {
          console.log("INTERCEPTOR: user has no token");
        }
      } else {
        console.log("INTERCEPTOR: no user in localStorage");
      }
    } catch (err) {
      console.error("Error reading token from localStorage", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;