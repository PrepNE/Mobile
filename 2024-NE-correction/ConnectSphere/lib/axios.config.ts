import _ from "axios";

export const axios = _.create({
    baseURL: "https://jsonplaceholder.typicode.com",
});

export default axios;