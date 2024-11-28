window.preloadedAudio = window.preloadedAudio || {};

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
let bgDynamicVolume = -6;  // volume in dB when no other tracks are playing
let backgroundVolume = -12;

async function userInteracted() {
    if (!window.audioContextStarted) {
        try {
            await Tone.start();
            window.audioContextStarted = true;
            console.log('Audio context started.');
        } catch (error) {
            console.error('Failed to start audio context:', error);
        }
    } else {
        console.log('Audio context already started.');
    }
}

// background track
function startBackgroundTrack() {
    const backgroundFile = "static/audio/group1/group1_background1.mp3";
    loadAndPlayAudio(backgroundFile, true, bgFadeDuration, function (player) {
        backgroundTrack = player;
        console.log("Background track started.");
        updateBackgroundTrackVolume(); // adjust volume based on currentTrack
    }, bgDynamicVolume); // set initial volume
}

async function togglePlayback() {
    let playButton = document.getElementById('playButton');
    let playTextElement = document.querySelector('.play-text');
    let currentLanguage = localStorage.getItem('appLanguage') || 'english';
    let currentPage = document.body.dataset.page;
    let texts = languageData[currentLanguage][currentPage].texts;

    if (isPlaying) {
        stopAllPlayback(true);
        playButton.src = 'static/images/playButton.png';
        isPlaying = false;
    } else {
        isPlaying = true;
        playButton.src = 'static/images/pauseButton.png';

        // ensure the Tone.js audio context is started
        await userInteracted();

        // start the background track
        startBackgroundTrack();

        // get current location and handle location change
        if (typeof window.latitude !== 'undefined' && typeof window.longitude !== 'undefined') {
            handleLocationChange(window.latitude, window.longitude);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        let latitude = position.coords.latitude;
                        let longitude = position.coords.longitude;

                        window.latitude = latitude;
                        window.longitude = longitude;

                        handleLocationChange(latitude, longitude);
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
    if (playTextElement) {
        const playText = texts.playText;
        if (playText) {
            playTextElement.textContent = isPlaying ? playText.pause : playText.play;
        }
    }
}

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

    // square1: bottom left lat: 22.5525, long: 114.0914, top right lat: 22.5546, long: 114.0920
    // square2: bottom left lat: 22.5524, long: 114.0918, top right lat: 22.5543, long: 114.0933
    // square3: bottom left lat: 22.5520, long: 114.0933, top right lat: 22.5540, long: 114.0942
    // square4: bottom left lat: 22.5517, long: 114.0944, top right lat: 22.5538, long: 114.0952
    // square5: bottom left lat: 22.5515, long: 114.0955, top right lat: 22.5536, long: 114.0962
    // square6: bottom left lat: 22.5512, long: 114.0967, top right lat: 22.5534, long: 114.0969

    // adjust the following conditions for actual location-based playback
    if (latitude > 22.5525 && latitude < 22.5546 && longitude > 114.0914 && longitude < 114.0920) {
        playTrack(tracks["location1"], "location1");
    } else if (latitude > 22.5524 && latitude < 22.5543 && longitude > 114.0918 && longitude < 114.0933) {
        playTrack(tracks["location2"], "location2");
    } else if (latitude > 22.5520 && latitude < 22.5540 && longitude > 114.0933 && longitude < 114.0942) {
        playTrack(tracks["location3"], "location3");
    } else if (latitude > 22.5517 && latitude < 22.5538 && longitude > 114.0944 && longitude < 114.0952) {
        playTrack(tracks["location4"], "location4");
    } else if (latitude > 22.5515 && latitude < 22.5536 && longitude > 114.0955 && longitude < 114.0962) {
        playTrack(tracks["location5"], "location5");
    } else if (latitude > 22.5512 && latitude < 22.5534 && longitude > 114.0967 && longitude < 114.0969) {
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
