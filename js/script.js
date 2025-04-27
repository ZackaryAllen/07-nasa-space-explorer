// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Set up the date pickers with:
// - A start date 9 days ago
// - Today as the end date
// - Makes sure you can't pick dates before 1995
setupDateInputs(startInput, endInput);

// Add an event listener to the button
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Create a modal element
const modal = document.createElement('div');
modal.id = 'modal';
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
modal.style.zIndex = '1000';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.color = 'white';
modal.style.padding = '20px';
modal.style.overflowY = 'auto';
modal.innerHTML = '<div id="modal-content" style="background: #333; padding: 20px; border-radius: 8px; max-width: 90%; max-height: 90%; width: 100%; text-align: center; position: relative; overflow-y: auto;"><button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: #ff4d4d; color: white; border: none; padding: 10px 15px; font-size: 16px; cursor: pointer; border-radius: 4px;">Close</button></div>';
document.body.appendChild(modal);

const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Add a "Did You Know?" section above the gallery
const facts = [
  "The Sun accounts for about 99.86% of the total mass of the Solar System.",
  "A day on Venus is longer than a year on Venus.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Jupiter has 79 known moons, the most of any planet in our Solar System.",
  "The Milky Way galaxy is about 100,000 light-years in diameter."
];

// Select a random fact
const randomFact = facts[Math.floor(Math.random() * facts.length)];

// Create a "Did You Know?" section
const didYouKnowSection = document.createElement('div');
didYouKnowSection.className = 'did-you-know';
didYouKnowSection.style.marginBottom = '20px';
didYouKnowSection.style.padding = '10px';
didYouKnowSection.style.backgroundColor = '#fff';
didYouKnowSection.style.borderRadius = '8px';
didYouKnowSection.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
didYouKnowSection.innerHTML = `<strong>Did You Know?</strong> ${randomFact}`;

// Insert the section above the gallery
const container = document.querySelector('.container');
container.insertBefore(didYouKnowSection, document.getElementById('gallery'));

button.addEventListener('click', () => {
  // Display a loading message
  gallery.innerHTML = '<p>Loading images, please wait...</p>';

  // Get the selected date range
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Fetch data from NASA's APOD API
  const apiKey = 'b3mv2HZWO4YLHgRIdX4PDjuYM9aE9mO2L8inRMST'; // Replace with your API key if available
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // Check if data is empty
      if (data.length === 0) {
        gallery.innerHTML = '<p>No images found for the selected date range.</p>';
        return;
      }

      // Display each image in the gallery
      data.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;

        const title = document.createElement('p');
        title.textContent = `${item.title} (${item.date})`;

        galleryItem.appendChild(img);
        galleryItem.appendChild(title);

        galleryItem.addEventListener('click', () => {
          modal.style.display = 'flex';
          modalContent.innerHTML = `
            <button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: #ff4d4d; color: white; border: none; padding: 10px 15px; font-size: 16px; cursor: pointer; border-radius: 4px;">Close</button>
            <img src="${item.url}" alt="${item.title}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />
            <h2>${item.title}</h2>
            <p><strong>Date:</strong> ${item.date}</p>
            <p>${item.explanation}</p>
          `;
          document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
          });
        });

        gallery.appendChild(galleryItem);
      });
    })
    .catch(error => {
      gallery.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
