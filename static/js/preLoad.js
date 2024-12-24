// initialize global variables for preloaded audio and preloading status
window.preloadedAudio = window.preloadedAudio || {}; // object to store preloaded audio players
window.preloadingComplete = window.preloadingComplete || false; // flag to indicate if preloading is complete

// define audio files grouped by group number
const audioFilesByGroup = {
    1: [
        // group 1 files
        // chinese
        "static/audio/group1/chinese/group1_track1.mp3",
        "static/audio/group1/chinese/group1_track2.mp3",
        "static/audio/group1/chinese/group1_track3.mp3",
        "static/audio/group1/chinese/group1_track4.mp3",
        "static/audio/group1/chinese/group1_track5.mp3",
        "static/audio/group1/chinese/group1_track6.mp3",
        // english
        "static/audio/group1/english/group1_track1.mp3",
        "static/audio/group1/english/group1_track2.mp3",
        "static/audio/group1/english/group1_track3.mp3",
        "static/audio/group1/english/group1_track4.mp3",
        "static/audio/group1/english/group1_track5.mp3",
        "static/audio/group1/english/group1_track6.mp3",
        // background track
        "static/audio/group1/group1_background1.mp3",
    ],
    2: [
        // group 2 files
        // chinese
        "static/audio/group2/chinese/group2_track1.mp3",
        "static/audio/group2/chinese/group2_track2.mp3",
        "static/audio/group2/chinese/group2_track3.mp3",
        "static/audio/group2/chinese/group2_track4.mp3",
        // english
        "static/audio/group2/english/group2_track1.mp3",
        "static/audio/group2/english/group2_track2.mp3",
        "static/audio/group2/english/group2_track3.mp3",
        "static/audio/group2/english/group2_track4.mp3",
        // background track
        "static/audio/group2/group2_background2.mp3",
    ],
    3: [
        // group 3 files
        // chinese
        "static/audio/group3/chinese/group3_track1.mp3",
        "static/audio/group3/chinese/group3_track2.mp3",
        "static/audio/group3/chinese/group3_track3.mp3",
        "static/audio/group3/chinese/group3_track4.mp3",
        // english
        "static/audio/group3/english/group3_track1.mp3",
        "static/audio/group3/english/group3_track2.mp3",
        "static/audio/group3/english/group3_track3.mp3",
        "static/audio/group3/english/group3_track4.mp3",
        // background track
        "static/audio/group3/group3_background3.mp3",
    ],
    4: [
        // group 4 files
        // chinese
        "static/audio/group4/chinese/group4_track1.mp3",
        "static/audio/group4/chinese/group4_track2.mp3",
        "static/audio/group4/chinese/group4_track3.mp3",
        "static/audio/group4/chinese/group4_track4.mp3",
        "static/audio/group4/chinese/group4_track5.mp3",
        "static/audio/group4/chinese/group4_track6.mp3",
        // english
        "static/audio/group4/english/group4_track1.mp3",
        "static/audio/group4/english/group4_track2.mp3",
        "static/audio/group4/english/group4_track3.mp3",
        "static/audio/group4/english/group4_track4.mp3",
        "static/audio/group4/english/group4_track5.mp3",
        "static/audio/group4/english/group4_track6.mp3",
        // background track
        "static/audio/group4/group4_background4.mp3",
    ]
};

// function to toggle visibility of group buttons for preloading
function toggleGroupButtons() {
    const groupButtonsContainer = document.getElementById('groupButtonsContainer');
    if (groupButtonsContainer) {
        if (groupButtonsContainer.style.display === 'none' || groupButtonsContainer.style.display === '') {
            // show the group buttons
            groupButtonsContainer.style.display = 'flex';

            // create group buttons if not already present
            if (groupButtonsContainer.children.length === 0) {
                for (let i = 1; i <= 4; i++) { // loop through group numbers
                    const groupButton = document.createElement('button'); // create a button for each group
                    groupButton.innerText = `${i}`; // set button text to group number
                    groupButton.id = `groupButton${i}`; // unique id for each button
                    groupButton.className = 'group-button'; // add a CSS class
                    groupButton.addEventListener('click', function () {
                        preloadGroup(i); // preload the group's audio files when clicked
                    });
                    groupButtonsContainer.appendChild(groupButton); // add the button to the container
                }
            }
        } else {
            // hide the group buttons
            groupButtonsContainer.style.display = 'none';
            // clear the cache and dispose of preloaded players
            clearPreloadedAudio();
            window.preloadingComplete = false;
            console.log('Cache cleared.');
        }
    }
}

// function to preload audio files for a specific group
function preloadGroup(groupNumber) {
    const audioFiles = audioFilesByGroup[groupNumber]; // get the audio files for the specified group
    let loadedCount = 0; // counter for loaded files
    const totalFiles = audioFiles.length; // total number of files in the group

    // update group button text to indicate loading
    const groupButton = document.getElementById(`groupButton${groupNumber}`);
    if (groupButton) {
        groupButton.disabled = true; // disable button to prevent multiple clicks
        groupButton.innerText = `...`; // indicate loading
    }

    audioFiles.forEach(file => {
        if (!window.preloadedAudio[file]) {
            // preload the audio file using Tone.Player
            const player = new Tone.Player({
                url: file, // file URL
                autostart: false, // do not start playing automatically
                loop: file.includes('background'), // loop if it's a background track
                onload: () => {
                    loadedCount++; // increment loaded counter
                    console.log(`Loaded ${file}`);
                    player.isPreloaded = true; // mark player as preloaded
                    player.toDestination(); // connect to the audio destination
                    player.connected = true; // mark as connected
                    window.preloadedAudio[file] = player; // store the player
                    checkIfAllFilesLoaded(); // check if all files are loaded
                },
                onerror: (error) => {
                    loadedCount++; // increment loaded counter
                    console.error(`Error loading ${file}:`, error); // log error
                    window.preloadedAudio[file] = null; // mark file as failed to load
                    checkIfAllFilesLoaded(); // check if all files are loaded
                }
            });
        } else {
            // if file is already preloaded, increment loaded counter
            loadedCount++;
            checkIfAllFilesLoaded(); // check if all files are loaded
        }
    });

    function checkIfAllFilesLoaded() {
        // update user feedback with progress
        if (groupButton) {
            groupButton.innerText = `${loadedCount}/${totalFiles}`;
        }

        if (loadedCount === totalFiles) {
            window.preloadingComplete = true; // mark as complete
            console.log(`All files for group ${groupNumber} have been preloaded.`);

            // update the button to indicate completion
            if (groupButton) {
                groupButton.innerText = `✓`;
                groupButton.disabled = true;
                groupButton.classList.add('preloaded'); 
            }
        }
    }
}


// function to clear all preloaded audio players
function clearPreloadedAudio() {
    for (let file in window.preloadedAudio) {
        const player = window.preloadedAudio[file]; // get the player
        if (player && typeof player.dispose === 'function') {
            player.dispose(); // dispose of the player
            console.log(`Disposed player for ${file}`);
        }
    }
    window.preloadedAudio = {}; // reset the preloaded audio object
}

// set up event listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const preloadButton = document.getElementById('preloadIcon'); // get the preload button
    if (preloadButton) {
        // attach click event to toggle group buttons
        preloadButton.addEventListener('click', toggleGroupButtons);
    } else {
        console.error("Preload button not found.");
    }

    // initially hide group buttons container
    const groupButtonsContainer = document.getElementById('groupButtonsContainer');
    if (groupButtonsContainer) {
        groupButtonsContainer.style.display = 'none';
    }
});
