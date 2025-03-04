// Utility function to get saved pairs from localStorage
function getSavedPairs() {
  const savedPairs = localStorage.getItem('pairs');
  return savedPairs ? JSON.parse(savedPairs) : [];
}

// Utility function to save pairs to localStorage
function savePairs(pairs) {
  localStorage.setItem('pairs', JSON.stringify(pairs));
}

// Function to render keyword-input pairs from saved data
function renderPairs() {
  const container = document.getElementById('keyword-container');
  const savedPairs = getSavedPairs();
  container.innerHTML = ''; // Clear current pairs before rendering

  savedPairs.forEach((pair, index) => {
    const pairDiv = document.createElement('div');
    pairDiv.classList.add('keyword-pair');
    
    // Keyword input (disabled for editing)
    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.value = pair.keyword;
    keywordInput.disabled = true;  // Prevent editing the saved keyword

    // Text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = pair.text;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => {
      deletePair(index);
    });

    pairDiv.appendChild(keywordInput);
    pairDiv.appendChild(textInput);
    pairDiv.appendChild(deleteBtn);
    container.appendChild(pairDiv);
  });
}

// Function to add a new keyword-input pair
function addPair() {
  const container = document.getElementById('keyword-container');
  
  // Create new pair div
  const pairDiv = document.createElement('div');
  pairDiv.classList.add('keyword-input');
  
  const keywordInput = document.createElement('input');
  keywordInput.type = 'text';
  keywordInput.placeholder = 'Enter keyword';
  
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Enter text for autofill';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'x';
  deleteBtn.addEventListener('click', () => {
    container.removeChild(pairDiv);
  });

  pairDiv.appendChild(keywordInput);
  pairDiv.appendChild(textInput);
  pairDiv.appendChild(deleteBtn);
  container.appendChild(pairDiv);
}

// Function to save the keyword-input pairs to localStorage
function saveAllPairs() {
  const container = document.getElementById('keyword-container');
  const pairs = [];

  // Get all keyword-input pairs
  const pairDivs = container.getElementsByClassName('keyword-input');
  Array.from(pairDivs).forEach((pairDiv) => {
    const keywordInput = pairDiv.querySelector('input[type="text"]:first-of-type');
    const textInput = pairDiv.querySelector('input[type="text"]:nth-of-type(2)');
    
    // Only save pairs if both fields are filled
    if (keywordInput.value.trim() && textInput.value.trim()) {
      pairs.push({
        keyword: keywordInput.value,
        text: textInput.value,
      });
    }
  });

  savePairs(pairs);
  renderPairs(); // Re-render the pairs after saving
}

// Function to delete a specific pair by index
function deletePair(index) {
  const pairs = getSavedPairs();
  pairs.splice(index, 1);  // Remove the pair at the given index
  savePairs(pairs);
  renderPairs();  // Re-render the pairs after deletion
}

// Function to handle the autofill toggle switch
function handleAutofillToggle() {
  const isAutofillOn = document.getElementById('autofill-toggle').checked;

  // Save the toggle state to chrome storage
  chrome.storage.sync.set({ autofillEnabled: isAutofillOn });
}

// Event listeners for buttons
document.getElementById('add-pair-btn').addEventListener('click', addPair);
document.getElementById('save-btn').addEventListener('click', saveAllPairs);
document.getElementById('clear-btn').addEventListener('click', () => {
  localStorage.removeItem('pairs');
  renderPairs();
});

// Handle the toggle for enabling/disabling auto-fill
document.getElementById('autofill-toggle').addEventListener('change', handleAutofillToggle);

// Fetch and set the state of autofill toggle on page load
chrome.storage.sync.get('autofillEnabled', (data) => {
  if (data.autofillEnabled !== undefined) {
    document.getElementById('autofill-toggle').checked = data.autofillEnabled;
  } else {
    // Default state (optional, set to true or false by default)
    document.getElementById('autofill-toggle').checked = true;
  }
});

// Initial render of saved pairs
renderPairs();
