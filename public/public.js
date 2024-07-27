let emojis = ["💼", "🏢"];

function randEmoji() {
  let icons = document.querySelectorAll(".icons");
  for (let i = 0; i < icons.length; ++i) {
    icons[i].innerHTML = emojis[i];
  }
}

// Add this function to your public.js file

function logInputValues() {
  // Select all input elements
  const inputs = document.querySelectorAll("input");

  // Loop through each input
  inputs.forEach((input) => {
    console.log(`${input.name}: ${input.value}`);
  });
}

// Add an event listener to the form
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // This should prevent the form from submitting
    console.log("Form submission prevented");
    logInputValues();
  });

// importing the database created in firebase-config.js
// import {db} from './firebase-config.js';
// import axios from 'axios';
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

console.log("hi");
let title, jobLocation;
function QueryInputs() {
  // Select all input elements
  const inputs = document.querySelectorAll("input");

  // Loop through each input
  inputs.forEach((input) => {
    if (input.type === "text") {
      if (input.name === "jobTitle") {
        title = input.value;
      } else if (input.name === "location") {
        jobLocation = input.value;
      }
    }
  });
}

// async function fetchJobs() {
//   try {
//     const response = await axios.get
//   }
// }

document
  .getElementById("searchForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Form submission prevented");
    QueryInputs();
    console.log(`title: ${title} : location: ${jobLocation}`);

    try {
      const response = await axios.post("/api/search-and-store-jobs", {
        jobTitle: title,
        location: jobLocation,
      });
      console.log("Server response:", response.data);

      if (response.data.jobs) {
        console.log("Jobs received from server:", response.data.jobs);
        // You can process or display the jobs data here
      }

      alert("Jobs fetched and stored successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
// Run the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", randEmoji);

document.getElementById("jobList").innerHTML = "🥰";  
