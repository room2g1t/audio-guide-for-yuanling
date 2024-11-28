document.addEventListener('DOMContentLoaded', function () {
    let playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', togglePlayback);
    }
});

window.audioContextStarted = window.audioContextStarted || false;

let currentTrack = null;
let fadeInDuration = 2000; // adjust as needed
let fadeOutDuration = 2000; // adjust as needed
let currentlyPlayingLocation = null; // track which location's track is currently playing

function getTracks() {
    let currentLanguage = localStorage.getItem('appLanguage') || 'english';
    let currentPage = document.body.dataset.page;
    return languageData[currentLanguage][currentPage].audio.tracks;
}

let isPlaying = false;
let backgroundTrack = null;
let isTrackLoading = false;

let bgFadeDuration = 2000; // fade in/out duration in milliseconds
let bgDynamicVolume = -4;  // volume in dB when no other tracks are playing
let backgroundVolume = -14;

async function userInteracted() {
    if (!window.audioContextStarted) {
        try {
            await Tone.start();
            window.audioContextStarted = true;
            console.log('audio context started.');
        } catch (error) {
            console.error('failed to start audio context:', error);
        }
    } else {
        console.log('audio context already started.');
    }
}

// background track
function startBackgroundTrack() {
    const backgroundFile = "static/audio/group3/group3_background3.mp3";
    loadAndPlayAudio(backgroundFile, true, bgFadeDuration, function(player) {
        backgroundTrack = player;
        console.log("background track started.");
        updateBackgroundTrackVolume(); // adjust volume based on currentTrack
    }, bgDynamicVolume); // set initial volume
}


async function togglePlayback() {
    let playButton = document.getElementById('playButton');

    if (isPlaying) {
        stopAllPlayback(true);
        playButton.src = 'static/images/playButton.png';
        isPlaying = false;
    } else {
        isPlaying = true;
        playButton.src = 'static/images/pauseButton.png';
        console.log("user initiated playback. GPS-based playback now enabled.");

        // ensure the Tone.js audio context is started
        await userInteracted();

        // start the background track
        startBackgroundTrack();

        // if current location is available, call handleLocationChange()
        if (typeof window.latitude !== 'undefined' && typeof window.longitude !== 'undefined') {
            handleLocationChange(window.latitude, window.longitude);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        let latitude = position.coords.latitude;
                        let longitude = position.coords.longitude;

                        window.latitude = latitude;
                        window.longitude = longitude;

                        handleLocationChange(latitude, longitude);
                    },
                    function(error) {
                        console.error("Error getting current position: ", error);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                console.error('Geolocation is not supported by your browser.');
            }
        }
    }
}

function stopAllPlayback(userStopped = false) {
    if (currentTrack) {
        currentTrack.stop(); // stops immediately with fade out applied
        currentTrack = null;
        currentlyPlayingLocation = null;
        isTrackLoading = false; // reset loading flag
    }

    if (backgroundTrack) {
        backgroundTrack.stop(); // stops with fade out applied
        backgroundTrack = null;
        console.log("background track stopped.");
    }

    if (userStopped) {
        isPlaying = false;
        console.log("user stopped playback.");
    } else {
        console.log("playback stopped due to location change.");
    }
}

function playTrack(trackFile, locationKey) {
    if ((currentTrack || isTrackLoading) && currentlyPlayingLocation === locationKey) return;

    if (currentTrack && currentlyPlayingLocation !== locationKey) {
        console.log('crossfading to new track...');

        let oldTrack = currentTrack;

        // start the new track
        startNewTrack(trackFile, locationKey, true);

        // stop the old track
        oldTrack.stop(); // stops with fade out applied
    } else if (!currentTrack && !isTrackLoading) {
        startNewTrack(trackFile, locationKey, true);
    }
}

function startNewTrack(trackFile, locationKey, fadeIn = false) {
    if (isTrackLoading) {
        console.log('track is already loading. Skipping startNewTrack.');
        return;
    }
    isTrackLoading = true; // set loading flag to true
    currentlyPlayingLocation = locationKey; // set this immediately

    console.log(`attempting to start new track: ${trackFile}`);

    loadAndPlayAudio(trackFile, false, fadeIn, function(player) {
        currentTrack = player;
        isTrackLoading = false; // reset loading flag
        console.log(`playing track: ${trackFile}`);
    });
}

function loadAndPlayAudio(file, loop = true, fadeInDuration = 0, callback, initialVolume = -4) {
    const player = new Tone.Player({
        url: file,
        autostart: false,
        loop: loop,
        fadeOut: fadeOutDuration / 1000, // Convert ms to seconds
        volume: initialVolume, // Set initial volume
        onload: () => {
            player.toDestination();
            player.fadeIn = fadeInDuration / 1000; // Convert ms to seconds
            player.start();
            if (callback) callback(player);
        },
        onstop: () => {
            // Dispose of the player when it stops
            player.dispose();
            console.log(`Player for ${file} stopped and disposed.`);
            if (player === currentTrack) {
                currentTrack = null;
                currentlyPlayingLocation = null;
                updateBackgroundTrackVolume();
            }
        },
        onerror: (error) => {
            console.error(`error loading ${file}:`, error);
        }
    });
}

function updateBackgroundTrackVolume() {
    if (backgroundTrack) {
        if (currentTrack) {
            // other track is playing, fade background track volume down
            backgroundTrack.volume.rampTo(backgroundVolume, bgFadeDuration / 1000);
        } else {
            // no other tracks are playing, fade background track volume up
            backgroundTrack.volume.rampTo(bgDynamicVolume, bgFadeDuration / 1000);
        }
    }
}


async function handleLocationChange(latitude, longitude) {
    console.log(`handleLocationChange called with latitude: ${latitude}, longitude: ${longitude}`);

    if (!isPlaying) {
        console.log("playback is not active. Ignoring GPS location check.");
        return;
    }

    if (!window.audioContextStarted) {
        await userInteracted();
    }

    let tracks = getTracks();

    // square1: bottom left lat: 22.5519, long: 114.0953, top right lat: 22.5536, long: 114.0961
    // square2: bottom left lat: 22.5533, long: 114.0931, top right lat: 22.5539, long: 114.0950
    // square3: bottom left lat: 22.5527, long: 114.0918, top right lat: 22.5544, long: 114.0932
    // square4: bottom left lat: 22.5523, long: 114.0918, top right lat: 22.5516, long: 114.0966

    // adjust the following conditions for actual location-based playback
    if (latitude > 22.5519 && latitude < 22.5536 && longitude > 114.0953 && longitude < 114.0961) {
        playTrack(tracks["location1"], "location1");
    } else if (latitude > 22.5533 && latitude < 22.5539 && longitude > 114.0931 && longitude < 114.0950) {
        playTrack(tracks["location2"], "location2");
    } else if (latitude > 22.5527 && latitude < 22.5544 && longitude > 114.0918 && longitude < 114.0932) {
        playTrack(tracks["location3"], "location3");
    } else if (latitude > 22.5523 && latitude < 22.5516 && longitude > 114.0918 && longitude < 114.0966) {
        playTrack(tracks["location4"], "location4");
    } else {
        console.log("no track assigned for this location.");
        // optionally, stop the current track if not in any location
        if (currentTrack) {
            currentTrack.fadeOut = fadeOutDuration / 1000; // in seconds
            currentTrack.stop("+0"); // stops with fade out applied
            currentTrack = null;
            currentlyPlayingLocation = null;
        }
    }

    if (backgroundTrack) {
        if (playingSquares.length > 0) {
            // other tracks are playing, fade background track volume down to backgroundVolume (slider value)
            backgroundTrack.volume.rampTo(backgroundVolume, bgFadeDuration);
        } else {
            // no other tracks are playing, fade background track volume up to bgDynamicVolume
            backgroundTrack.volume.rampTo(bgDynamicVolume, bgFadeDuration);
        }
    }
    
}

// attach handleLocationChange to the window object so it can be accessed globally
window.handleLocationChange = handleLocationChange;
