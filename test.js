// // Load environment variables from a .env file into process.env
import 'dotenv/config';

// // Import the Express framework for building web applications
// import express from "express";

// // Import Axios for making HTTP requests
// import axios from "axios";

// // Import CORS middleware to allow cross-origin requests
// import cors from "cors";

// // Create an instance of an Express application
// const app = express();
console.log("hi");
// // Set the port to the value from the environment variable or default to 3000
const apiKey = process.env.API_KEY

console.log(apiKey)