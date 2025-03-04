// Utility function to get saved pairs from localStorage
function getSavedPairs() {
  const savedPairs = localStorage.getItem('pairs');
  return savedPairs ? JSON.parse(savedPairs) : [];
}

// Function to handle autofilling the form
function autofillForm() {
  // Get the saved pairs
  const savedPairs = getSavedPairs();
  
  // Get all input fields (text, email, textarea)
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
  
  inputs.forEach(input => {
    // Check if the input has a matching saved keyword
    savedPairs.forEach(pair => {
      if (input.placeholder && input.placeholder.includes(pair.keyword)) {
        // Fill in the input with the saved text
        input.value = pair.text;
      }
    });
  });
}

// Check if the autofill should be enabled (based on the sync storage)
chrome.storage.sync.get("autofillEnabled", (data) => {
  if (data.autofillEnabled) {
    autofillForm();  // Autofill if the toggle is ON
  }
});
