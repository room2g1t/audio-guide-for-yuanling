// ensure the preloadedAudio object exists for caching audio files
window.preloadedAudio = window.preloadedAudio || {};

// add an event listener to execute code after the page's DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    let playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', togglePlayback);
    }
});

window.audioContextStarted = window.audioContextStarted || false;

// initialize variables for audio playback
let currentTrack = null; // current playing audio track
let fadeInDuration = 2000; // duration for fade-in effect in milliseconds
let fadeOutDuration = 2000; // duration for fade-out effect in milliseconds
let currentlyPlayingLocation = null; // tracks the currently playing location's audio

// function to get the audio tracks for the current page and language
function getTracks() {
    let currentLanguage = localStorage.getItem('appLanguage') || 'english'; // get current language
    let currentPage = document.body.dataset.page; // get current page identifier
    return languageData[currentLanguage][currentPage].audio.tracks; // return tracks for the page
}

// playback state variables
let isPlaying = false; // whether audio is currently playing
let backgroundTrack = null; // background track player
let isTrackLoading = false; // flag to indicate if a track is loading
let bgFadeDuration = 2000; // fade duration for background audio in milliseconds
let bgDynamicVolume = -6;  // volume (in dB) when no tracks are playing
let backgroundVolume = -16; // volume (in dB) when a track is playing

// function to start the audio context after user interaction
async function userInteracted() {
    if (!window.audioContextStarted) {
        try {
            await Tone.start(); // start Tone.js audio context
            window.audioContextStarted = true; // mark context as started
            console.log('Audio context started.');
        } catch (error) {
            console.error('Failed to start audio context:', error);
        }
    } else {
        console.log('Audio context already started.');
    }
}

// function to start the background track
function startBackgroundTrack() {
    const backgroundFile = "static/audio/group1/group1_background1.mp3"; // path to background audio
    loadAndPlayAudio(backgroundFile, true, bgFadeDuration, function (player) {
        backgroundTrack = player;
        console.log("Background track started.");
        updateBackgroundTrackVolume(); // adjust volume based on playback state
    }, bgDynamicVolume); // set initial volume
}

// function to toggle playback of audio
async function togglePlayback() {
    let playButton = document.getElementById('playButton'); // play button element
    let playTextElement = document.querySelector('.play-text'); // text element for play/pause state
    let currentLanguage = localStorage.getItem('appLanguage') || 'english'; // current language
    let currentPage = document.body.dataset.page; // current page identifier
    let texts = languageData[currentLanguage][currentPage].texts; // text data for the page

    if (isPlaying) {
        stopAllPlayback(true); // stop playback
        playButton.src = 'static/images/playButton.png'; // update play button image
        isPlaying = false; // update playback state
    } else {
        isPlaying = true; // update playback state
        playButton.src = 'static/images/pauseButton.png'; // update pause button image

        await userInteracted(); // ensure audio context is started
        startBackgroundTrack(); // start the background audio

        // check current location and handle playback based on location
        if (typeof window.latitude !== 'undefined' && typeof window.longitude !== 'undefined') {
            handleLocationChange(window.latitude, window.longitude);
        } else {
             // request location from the browser
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        let latitude = position.coords.latitude; // get latitude
                        let longitude = position.coords.longitude; // get longitude

                        window.latitude = latitude; // save latitude globally
                        window.longitude = longitude; // save longitude globally

                        handleLocationChange(latitude, longitude); // handle location change
                    },
                    function (error) {
                        console.error("Error getting current position: ", error);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                console.error('Geolocation is not supported by your browser.');
            }
        }
    }

    // update the play/pause text based on playback state
    if (playTextElement) {
        const playText = texts.playText;
        if (playText) {
            playTextElement.textContent = isPlaying ? playText.pause : playText.play;
        }
    }
}

// function to stop all audio playback
function stopAllPlayback(userStopped = false) {
    if (currentTrack) {
        currentTrack.stop(); // stops with fade out applied
        // currentTrack and currentlyPlayingLocation will be reset in onstop handler
        isTrackLoading = false; // reset loading flag
        updateBackgroundTrackVolume(); // update background volume
    }

    if (backgroundTrack) {
        backgroundTrack.stop(); // stops with fade out applied
        backgroundTrack = null;
        console.log("Background track stopped.");
    }

    if (userStopped) {
        isPlaying = false;
        console.log("User stopped playback.");
    } else {
        console.log("Playback stopped due to location change.");
    }
}

function playTrack(trackFile, locationKey) {
    if ((currentTrack || isTrackLoading) && currentlyPlayingLocation === locationKey) return;

    if (currentTrack && currentlyPlayingLocation !== locationKey) {
        console.log('Crossfading to new track...');

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
        console.log('Track is already loading. Skipping startNewTrack.');
        return;
    }
    isTrackLoading = true; // set loading flag to true
    currentlyPlayingLocation = locationKey; // set this immediately

    console.log(`Attempting to start new track: ${trackFile}`);

    loadAndPlayAudio(trackFile, false, fadeIn, function (player) {
        currentTrack = player;
        isTrackLoading = false; // reset loading flag
        console.log(`Playing track: ${trackFile}`);
        updateBackgroundTrackVolume(); // adjust background volume
    });
}

function loadAndPlayAudio(file, loop = true, fadeInDuration = 0, callback, initialVolume = -4) {
    // check if the audio file is preloaded
    if (window.preloadedAudio && window.preloadedAudio[file]) {
        console.log(`Using preloaded audio for ${file}`);
        const player = window.preloadedAudio[file];

        // ensure the player is connected to destination
        if (!player.connected) {
            player.toDestination();
            player.connected = true;
        }

        player.loop = loop;
        player.volume.value = initialVolume;
        player.fadeIn = fadeInDuration / 1000; // convert ms to seconds
        player.fadeOut = fadeOutDuration / 1000;
        player.start();
        if (callback) callback(player);
    } else {
        console.log(`Loading and playing audio for ${file}`);
        const player = new Tone.Player({
            url: file,
            autostart: false,
            loop: loop,
            fadeOut: fadeOutDuration / 1000, // convert ms to seconds
            volume: initialVolume, // set initial volume
            onload: () => {
                player.toDestination();
                player.fadeIn = fadeInDuration / 1000; // convert ms to seconds
                player.start();
                if (callback) callback(player);
                // add to preloadedAudio for future use
                window.preloadedAudio[file] = player;
            },
            onstop: () => {
                // dispose of the player when it stops if it's not preloaded
                if (!player.isPreloaded) {
                    player.dispose();
                    console.log(`Player for ${file} stopped and disposed.`);
                } else {
                    console.log(`Player for ${file} stopped but not disposed (preloaded).`);
                }
                if (player === currentTrack) {
                    currentTrack = null;
                    currentlyPlayingLocation = null;
                    updateBackgroundTrackVolume(); // adjust background volume
                }
            },
            onerror: (error) => {
                console.error(`Error loading ${file}:`, error);
            }
        });
    }
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

// function to handle playback based on location
async function handleLocationChange(latitude, longitude) {
    console.log(`handleLocationChange called with latitude: ${latitude}, longitude: ${longitude}`);

    if (!isPlaying) {
        console.log("Playback is not active. Ignoring GPS location check.");
        return;
    }

    if (!window.audioContextStarted) {
        await userInteracted();
    }

    let tracks = getTracks();

    // play specific audio tracks based on latitude and longitude
    if (latitude > 22.5521 && latitude < 22.5543 && longitude > 114.0913 && longitude < 114.0916) {
        playTrack(tracks["location1"], "location1");
    } else if (latitude > 22.5521 && latitude < 22.5543 && longitude > 114.0916 && longitude < 114.0932) {
        playTrack(tracks["location2"], "location2");
    } else if (latitude > 22.5521 && latitude < 22.5543 && longitude > 114.0932 && longitude < 114.0947) {
        playTrack(tracks["location3"], "location3");
    } else if (latitude > 22.5543 && latitude < 22.5563 && longitude > 114.0932 && longitude < 114.0947) {
        playTrack(tracks["location4"], "location4");
    } else if (latitude > 22.55221 && latitude < 22.5543 && longitude > 114.0947 && longitude < 114.0960) {
        playTrack(tracks["location5"], "location5");
    } else if (latitude > 22.5527 && latitude < 22.5520 && longitude > 114.0961 && longitude < 114.0971) {
        playTrack(tracks["location6"], "location6");
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
    
}

// attach handleLocationChange to the window object so it can be accessed globally
window.handleLocationChange = handleLocationChange;
