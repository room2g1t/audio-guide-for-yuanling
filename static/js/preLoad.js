// Initialize global variables
window.preloadedAudio = window.preloadedAudio || {};
window.preloadingComplete = window.preloadingComplete || false;

// Audio files organized by group
const audioFilesByGroup = {
    1: [
        // Group 1 files
        // Chinese
        "static/audio/group1/chinese/group1_track1.mp3",
        "static/audio/group1/chinese/group1_track2.mp3",
        "static/audio/group1/chinese/group1_track3.mp3",
        "static/audio/group1/chinese/group1_track4.mp3",
        "static/audio/group1/chinese/group1_track5.mp3",
        "static/audio/group1/chinese/group1_track6.mp3",
        // English
        "static/audio/group1/english/group1_track1.mp3",
        "static/audio/group1/english/group1_track2.mp3",
        "static/audio/group1/english/group1_track3.mp3",
        "static/audio/group1/english/group1_track4.mp3",
        "static/audio/group1/english/group1_track5.mp3",
        "static/audio/group1/english/group1_track6.mp3",
        // Background track
        "static/audio/group1/group1_background1.mp3",
    ],
    2: [
        // Group 2 files
        // Chinese
        "static/audio/group2/chinese/group2_track1.mp3",
        "static/audio/group2/chinese/group2_track2.mp3",
        "static/audio/group2/chinese/group2_track3.mp3",
        "static/audio/group2/chinese/group2_track4.mp3",
        // English
        "static/audio/group2/english/group2_track1.mp3",
        "static/audio/group2/english/group2_track2.mp3",
        "static/audio/group2/english/group2_track3.mp3",
        "static/audio/group2/english/group2_track4.mp3",
        // Background track
        "static/audio/group2/group2_background2.mp3",
    ],
    3: [
        // Group 3 files
        // Chinese
        "static/audio/group3/chinese/group3_track1.mp3",
        "static/audio/group3/chinese/group3_track2.mp3",
        "static/audio/group3/chinese/group3_track3.mp3",
        "static/audio/group3/chinese/group3_track4.mp3",
        // English
        "static/audio/group3/english/group3_track1.mp3",
        "static/audio/group3/english/group3_track2.mp3",
        "static/audio/group3/english/group3_track3.mp3",
        "static/audio/group3/english/group3_track4.mp3",
        // Background track
        "static/audio/group3/group3_background3.mp3",
    ],
    4: [
        // Group 4 files
        // Chinese
        "static/audio/group4/chinese/group4_track1.mp3",
        "static/audio/group4/chinese/group4_track2.mp3",
        "static/audio/group4/chinese/group4_track3.mp3",
        "static/audio/group4/chinese/group4_track4.mp3",
        "static/audio/group4/chinese/group4_track5.mp3",
        "static/audio/group4/chinese/group4_track6.mp3",
        // English
        "static/audio/group4/english/group4_track1.mp3",
        "static/audio/group4/english/group4_track2.mp3",
        "static/audio/group4/english/group4_track3.mp3",
        "static/audio/group4/english/group4_track4.mp3",
        "static/audio/group4/english/group4_track5.mp3",
        "static/audio/group4/english/group4_track6.mp3",
        // Background track
        "static/audio/group4/group4_background4.mp3",
    ]
};

function toggleGroupButtons() {
    const groupButtonsContainer = document.getElementById('groupButtonsContainer');
    if (groupButtonsContainer) {
        if (groupButtonsContainer.style.display === 'none' || groupButtonsContainer.style.display === '') {
            // Show the group buttons
            groupButtonsContainer.style.display = 'flex';

            // Create group buttons if they don't exist
            if (groupButtonsContainer.children.length === 0) {
                // Create buttons for groups 1-4
                for (let i = 1; i <= 4; i++) {
                    const groupButton = document.createElement('button');
                    groupButton.innerText = `${i}`;
                    groupButton.id = `groupButton${i}`;
                    groupButton.className = 'group-button'; // Add CSS class
                    groupButton.addEventListener('click', function () {
                        preloadGroup(i);
                    });
                    groupButtonsContainer.appendChild(groupButton);
                }
            }
        } else {
            // Hide the group buttons
            groupButtonsContainer.style.display = 'none';
            // Clear the cache
            window.preloadedAudio = {};
            window.preloadingComplete = false;
            console.log('Cache cleared.');
        }
    }
}

function preloadGroup(groupNumber) {
    const audioFiles = audioFilesByGroup[groupNumber];

    let loadedCount = 0;
    const totalFiles = audioFiles.length;

    // Change group button text to indicate loading
    const groupButton = document.getElementById(`groupButton${groupNumber}`);
    if (groupButton) {
        groupButton.disabled = true; // Disable the button to prevent multiple clicks
        groupButton.innerText = `...`;
    }

    audioFiles.forEach(file => {
        if (!window.preloadedAudio[file]) {
            // Preload using Tone.Player
            const player = new Tone.Player({
                url: file,
                autostart: false,
                loop: file.includes('background'),
                onload: () => {
                    loadedCount++;
                    console.log(`Loaded ${file}`);
                    window.preloadedAudio[file] = player;
                    checkIfAllFilesLoaded();
                },
                onerror: (error) => {
                    loadedCount++;
                    console.error(`Error loading ${file}:`, error);
                    // Mark the file as failed to load
                    window.preloadedAudio[file] = null;
                    checkIfAllFilesLoaded();
                }
            }).toDestination();
        } else {
            // If already preloaded, increment loadedCount
            loadedCount++;
            checkIfAllFilesLoaded();
        }
    });

    function checkIfAllFilesLoaded() {
        // Update user feedback with progress
        if (groupButton) {
            groupButton.innerText = `${loadedCount}/${totalFiles}`;
        }

        if (loadedCount === totalFiles) {
            window.preloadingComplete = true; // Mark as complete
            console.log(`All files for group ${groupNumber} have been preloaded.`);

            // Update the button to indicate completion
            if (groupButton) {
                groupButton.innerText = `✓`;
                groupButton.disabled = true;
                groupButton.classList.add('preloaded'); // Optional: Add a class to indicate completion
            }
        }
    }
}

// Attach event listener to preload button
document.addEventListener('DOMContentLoaded', function () {
    const preloadButton = document.getElementById('preloadIcon');
    if (preloadButton) {
        preloadButton.addEventListener('click', toggleGroupButtons);
    } else {
        console.error("Preload button not found.");
    }
    // Initially hide group buttons
    const groupButtonsContainer = document.getElementById('groupButtonsContainer');
    if (groupButtonsContainer) {
        groupButtonsContainer.style.display = 'none';
    }
});
