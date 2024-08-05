import * as functions from 'firebase-functions';
import express from "express";
import axios from "axios";
import { db } from "./firebase-admin-config.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// API route to fetch the latest 10 jobs
app.get("/api/latest-jobs", async (req, res) => {
  try {
    const jobsRef = db.collection("job-search");
    const snapshot = await jobsRef.orderBy("timestamp", "desc").limit(10).get();

    const jobs = [];
    snapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    res.status(500).json({ error: "An error occurred while fetching jobs.", details: error.message });
  }
});

// API route to search and store jobs
app.post("/api/search-and-store-jobs", async (req, res) => {
  try {
    const { jobTitle, location } = req.body;

    const options = {
      method: "GET",
      url: "https://jobs-api14.p.rapidapi.com/list",
      params: {
        query: jobTitle,
        location: location,
        distance: "1.0",
        language: "en_GB",
        remoteOnly: "false",
        datePosted: "month",
        employmentTypes: "fulltime",
        index: "0",
      },
      headers: {
        "x-rapidapi-key": functions.config().rapidapi.key,
        "x-rapidapi-host": "jobs-api14.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data;
    const jobs = data.jobs;

    if (!jobs || jobs.length === 0) {
      console.log("No jobs found in the API response");
      return res.json({ message: "No jobs found", jobs: [] });
    }

    const batch = db.batch();

    jobs.forEach((job) => {
      const customDocId = `${job.company} : ${job.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/(^-|-$)/g, "");

      console.log(`custom Id: ${customDocId}`);

      const docRef = db.collection("job-search").doc(customDocId);

      batch.set(
        docRef,
        {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description || "No description available",
          jobProviders: job.jobProviders,
          timestamp: job.datePosted,
        },
        { merge: true }
      );
    });

    await batch.commit();

    res.json({ message: "Jobs fetched and stored", jobs: jobs });
  } catch (error) {
    console.error("Full error:", error.response ? error.response.data : error);
    res.status(500).json({ error: "An error occurred while processing your request.", details: error.message });
  }
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);