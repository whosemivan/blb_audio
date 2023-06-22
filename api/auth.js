import axios from "../core/axios.js";
import {
    destroyCookie
} from "nookies";

export const login = async (values) => {
    return (await axios.post("/auth/login", values)).data;
};

export const register = async (values) => {
    return (await axios.post("/auth/register", values)).data;
};

export const getMe = async () => {
    return (await axios.get("/users/me")).data;
};

export const logout = () => {
    destroyCookie(null, "_token", {
        path: "/"
    });
};