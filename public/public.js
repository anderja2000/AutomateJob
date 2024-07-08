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
    document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault(); // This should prevent the form from submitting
        console.log("Form submission prevented");
        logInputValues();
    });

// Run the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", randEmoji);
