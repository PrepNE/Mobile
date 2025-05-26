import _ from "axios";

export const axios = _.create({
    baseURL: "https://dummyjson.com",
});

export default axios;