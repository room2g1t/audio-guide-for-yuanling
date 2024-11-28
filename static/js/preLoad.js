// initialize global variables
window.preloadedAudio = window.preloadedAudio || {};
window.preloadingComplete = window.preloadingComplete || false;

function startPreloading() {
    if (!window.preloadingComplete) {
        const audioFiles = [
            // group 1
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

            // group 2
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
            // add more below...

            // group 3
            // chinese
            "static/audio/group3/chinese/group3_track1.mp3",
            "static/audio/group3/chinese/group3_track2.mp3",
            // english
            "static/audio/group3/english/group3_track1.mp3",
            "static/audio/group3/english/group3_track2.mp3",
            // add more below...

            // group 4
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
            "static/audio/group1/group1_background.mp3",
            "static/audio/group2/group2_background.mp3",
            "static/audio/group3/group3_background.mp3",
            "static/audio/group4/group4_background.mp3"

        ];

        let loadedCount = 0;
        let totalFiles = audioFiles.length;

        // change button text to indicate loading
        const preloadButton = document.getElementById('preloadIcon');
        if (preloadButton) {
            preloadButton.disabled = true; // disable the button to prevent multiple clicks
            preloadButton.innerText = 'preloading...';
        }

        audioFiles.forEach(file => {
            if (!window.preloadedAudio[file]) {
                // preload using Tone.Player
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
                        // mark the file as failed to load
                        window.preloadedAudio[file] = null;
                        checkIfAllFilesLoaded();
                    }
                }).toDestination();
            } else {
                // if already preloaded, increment loadedCount
                loadedCount++;
                checkIfAllFilesLoaded();
            }
        });

        function checkIfAllFilesLoaded() {
            // update user feedback with progress
            if (preloadButton) {
                preloadButton.innerText = `preloading... (${loadedCount}/${totalFiles})`;
            }

            if (loadedCount === totalFiles) {
                window.preloadingComplete = true; // mark as complete
                console.log("all files have been preloaded.");

                // update the button to indicate completion
                if (preloadButton) {
                    preloadButton.innerText = 'preloading complete';
                    preloadButton.disabled = true;
                }
            }
        }
    }
}

// attach event listener to preload button
document.addEventListener('DOMContentLoaded', function () {
    const preloadButton = document.getElementById('preloadIcon');
    if (preloadButton) {
        preloadButton.addEventListener('click', startPreloading);
    } else {
        console.error("preload button not found.");
    }
});
