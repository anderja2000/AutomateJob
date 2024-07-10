import express from "express";
import axios from "axios";
import { db } from "./firebase-admin-config.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
app.use(express.json());
app.use(express.static("public")); // serving static files from the 'public' directory

app.post("/api/search-and-store-jobs", async (req, res) => {
  try {
    const { jobTitle, location } = req.body;

    const options = {
      method: "GET",
      url: "https://job-search-api1.p.rapidapi.com/v1/job-description-search",
      params: {
        q: jobTitle,
        page: "1",
        country: "us",
        city: location,
      },

      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "job-search-api1.p.rapidapi.com",
      },
    };
    
    const response = await axios.request(options); 
    const data = response.data; 

    console.log(data); 
    // // store the job postings with corresponding info in Firestore db; 
    // const batch = db.batch();
    // data.jobs.forEach((job) => { 
    //     const docRef = db.collection('jobs')
    // })
  } catch (error) {}
});
