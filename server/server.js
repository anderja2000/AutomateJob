import express from "express";
import axios from "axios";
import { db } from "./firebase-admin-config.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Timestamp } from "firebase-admin/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// this new route will fectch the latest 10 jobs
app.get("/api/latest-jobs", async (req, res) => {
  try {
    const jobsRef = db.collection("job-search");
    const snapshot = await jobsRef.orderBy("timestamp", "desc").limit(10).get();

    const jobs = [];
    snapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    res.json({jobs});
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    res.status(500).json({ error: "An error occurred while fetching jobs." });
  }
});

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
        "x-rapidapi-key": process.env.RAPID_API_KEY,
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
      // console.log(`Testing code:
      //   Title: ${job.title}
      //   Company: ${job.company_name}
      //   Location: ${job.location}
      //   URL: ${job.application_url}
      //   Description: ${job.description}
      //   date posted: ${job.datePosted}
      // `);

      // Create a custom document ID using company name and job title
      const customDocId = `${job.company} : ${job.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/(^-|-$)/g, "");

      console.log(`custom Id: ${customDocId}`);

      // Create a document reference with the custom ID
      // const docRef = db.collection("job-search").doc(customDocId);

      // Set the document data
      // batch.set(
      //   docRef,
      //   {
      //     title: job.title,
      //     company: job.company,
      //     location: job.location,
      //     description: job.description || "No description available",
      //     jobProviders: job.jobProviders,
      //     timestamp: job.datePosted,
      //   },
      //   { merge: true }
      // ); // Use merge: true to update existing documents without overwriting
    });

    // Commit the batch
    // await batch.commit();

    res.json({ message: "Jobs fetched and stored", jobs: jobs });
  } catch (error) {
    console.error("Full error:", error.response ? error.response.data : error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
