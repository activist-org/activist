import dotenv from 'dotenv'
dotenv.config()
import axios from "axios";

// import API from environment variables
const apiURL : string | undefined = process.env.API_URL

// add authorization headers to the request
const API = axios.create({baseURL: apiURL, });

export default API