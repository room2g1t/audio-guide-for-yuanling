document.addEventListener('DOMContentLoaded', function () {
    // global variables
    let isPlaying = false;
    let backgroundTrack = null;
    let trackPlayers = {}; 
    let playingSquares = [];
    let dotX, dotY;
    let blueSquares = [];
    let p5Instance;

    const groupSquaresData = {
        group1: [
            { x: -1, y: 323, w: 65, h: 370, number: 1 },
            { x: 51, y: 321, w: 200, h: 370, number: 2 },
            { x: 235, y: 321, w: 155, h: 370, number: 3 },
            { x: 378, y: 319, w: 145, h: 370, number: 4 },
            { x: 508, y: 317, w: 165, h: 370, number: 5 },
            { x: 656, y: 319, w: 125, h: 370, number: 6 },
        ],
        group2: [
            { x: 242, y: 592, w: 205, h: 165, number: 3 },
            { x: 236, y: 415, w: 210, h: 170, number: 2 },
            { x: 457, y: 589, w: 205, h: 170, number: 4 },
            { x: 457, y: 412, w: 210, h: 170, number: 1 },
        ],
        group3: [
            { x: 489, y: 313, w: 170, h: 315, number: 1 },
            { x: 217, y: 313, w: 285, h: 180, number: 2 },
            { x: 50, y: 312, w: 185, h: 325, number: 3 },
            { x: 50, y: 615, w: 615, h: 90, number: 4 },
        ],
        group4: [
            { x: 235, y: 389, w: 245, h: 125, number: 4 },
            { x: 237, y: 503, w: 235, h: 185, number: 3 },
            { x: 656, y: 498, w: 140, h: 185, number: 1 },
            { x: 454, y: 496, w: 215, h: 190, number: 2 },
            { x: 466, y: 391, w: 210, h: 120, number: 5 },
            { x: 658, y: 386, w: 145, h: 125, number: 6 },
        ],
    };
    
    const groupSettings = {
        group1: {
            bgFadeDuration: 2000,     // fade in/out duration in milliseconds
            bgDynamicVolume: -6,      // volume in dB when no other tracks are playing
            backgroundVolume: -12,    // initial background volume in dB
            tracksVolume: -4,         // initial tracks volume in dB
        },
        group2: {
            bgFadeDuration: 1500,
            bgDynamicVolume: -5,
            backgroundVolume: -64,
            tracksVolume: -8,
        },
        group3: {
            bgFadeDuration: 1800,
            bgDynamicVolume: -4,
            backgroundVolume: -11,
            tracksVolume: -7,
        },
        group4: {
            bgFadeDuration: 2000,
            bgDynamicVolume: -3,
            backgroundVolume: -26,
            tracksVolume: -15,
        },
    };
    
    let bgFadeDuration;
    let bgDynamicVolume;
    let backgroundVolume;
    let tracksVolume;

    let currentGroup = 'group1'; 
    
    // get the container element
    let container = document.getElementById('canvasContainer');
    container.style.position = 'relative';

    // create the display element
    let latLonDisplay = document.createElement('div');
    latLonDisplay.id = 'latLonDisplay';
    latLonDisplay.style.fontSize = '3vw';
    latLonDisplay.style.fontFamily = 'Arial';
    latLonDisplay.style.marginBottom = '0px';
    latLonDisplay.style.color = '#000000';
    latLonDisplay.style.textAlign = 'center';
    latLonDisplay.style.display = 'flex';
    latLonDisplay.style.flexDirection = 'column';  
    latLonDisplay.style.margin = '110px auto 0 auto';

    // insert it before the canvasContainer
    container.parentNode.insertBefore(latLonDisplay, container.nextSibling);

    function getTracks() {
        let currentLanguage = localStorage.getItem('appLanguage') || 'english';
        return languageData[currentLanguage][currentGroup].audio.tracks;
    }
    
    // volume sliders
    let backgroundVolumeSlider = document.getElementById('backgroundVolume');
    let tracksVolumeSlider = document.getElementById('tracksVolume');

    // create volume display labels
    let backgroundVolumeDisplay = document.createElement('span');
    backgroundVolumeDisplay.id = 'backgroundVolumeDisplay';
    backgroundVolumeDisplay.style.marginLeft = '10px';
    backgroundVolumeSlider.parentNode.appendChild(backgroundVolumeDisplay);

    let tracksVolumeDisplay = document.createElement('span');
    tracksVolumeDisplay.id = 'tracksVolumeDisplay';
    tracksVolumeDisplay.style.marginLeft = '10px';
    tracksVolumeSlider.parentNode.appendChild(tracksVolumeDisplay);

    // update volume displays
    backgroundVolumeDisplay.textContent = `${backgroundVolume} dB`;
    tracksVolumeDisplay.textContent = `${tracksVolume} dB`;

    loadSettingsForCurrentGroup();
    highlightSelectedButton(currentGroup);

    backgroundVolumeSlider.addEventListener('input', function () {
        backgroundVolume = Tone.gainToDb(parseFloat(backgroundVolumeSlider.value));
        backgroundVolumeDisplay.textContent = `${backgroundVolume.toFixed(1)} dB`;
    
        // update the group settings
        groupSettings[currentGroup].backgroundVolume = backgroundVolume;
    
        if (backgroundTrack && playingSquares.length > 0) {
            backgroundTrack.volume.rampTo(backgroundVolume, 0.1);
        }
    });
    
    tracksVolumeSlider.addEventListener('input', function () {
        tracksVolume = Tone.gainToDb(parseFloat(tracksVolumeSlider.value));
        tracksVolumeDisplay.textContent = `${tracksVolume.toFixed(1)} dB`;
    
        // update the group settings
        groupSettings[currentGroup].tracksVolume = tracksVolume;
    
        // recalculate volumes of playing tracks
        handleAudioPlayback();
    });
    
    document.getElementById('group1Button').addEventListener('click', function() {
        switchGroup('group1');
    });
    document.getElementById('group2Button').addEventListener('click', function() {
        switchGroup('group2');
    });
    document.getElementById('group3Button').addEventListener('click', function() {
        switchGroup('group3');
    });
    document.getElementById('group4Button').addEventListener('click', function() {
        switchGroup('group4');
    });
    
    function switchGroup(groupName) {
        currentGroup = groupName;
    
        loadSettingsForCurrentGroup();
        loadSquaresForCurrentGroup();
        updateTracksForCurrentGroup();
        highlightSelectedButton(groupName);

        let groupNumber = currentGroup.replace('group', '');
        let imagePath = `static/images/map/map${groupNumber}.png`;
        p5Instance.updateOverlayImage(imagePath);
    }
    
    
    function loadSquaresForCurrentGroup() {
        let squaresData = groupSquaresData[currentGroup];
    
        if (squaresData) {
            // use the default squares for the group
            blueSquares = squaresData.map(sqData => new DraggableSquare(
                sqData.x,
                sqData.y,
                sqData.w,
                sqData.h,
                p5Instance.color(255, 0, 0, 100),
                sqData.number
            ));
        } else {
            blueSquares = [];
        }
    }
    function loadSettingsForCurrentGroup() {
        const settings = groupSettings[currentGroup];
        if (settings) {
            bgFadeDuration = settings.bgFadeDuration;
            bgDynamicVolume = settings.bgDynamicVolume;
            backgroundVolume = settings.backgroundVolume;
            tracksVolume = settings.tracksVolume;
    
            // update volume sliders to reflect the new settings
            updateVolumeSliders();
        }
    }    
    
    function updateVolumeSliders() {
        // update background volume slider
        backgroundVolumeSlider.value = Tone.dbToGain(backgroundVolume);
        backgroundVolumeDisplay.textContent = `${backgroundVolume} dB`;
    
        // update tracks volume slider
        tracksVolumeSlider.value = Tone.dbToGain(tracksVolume);
        tracksVolumeDisplay.textContent = `${tracksVolume} dB`;
    }    

    async function userInteracted() {
        try {
            await Tone.start();
            console.log('Audio context started');
        } catch (error) {
            console.error('Failed to start audio context:', error);
        }
    }

    function updateTracksForCurrentGroup() {
        // stop all playing tracks
        Object.values(trackPlayers).forEach(player => {
            player.stop();
        });
        trackPlayers = {};
        playingSquares = [];
    
        // stop the current background track
        if (backgroundTrack) {
            backgroundTrack.stop();
            backgroundTrack.dispose(); 
            backgroundTrack = null;
        }
    
        // start background track if the audio is playing
        if (isPlaying) {
            startBackgroundTrack();
        }
    }
    
    
    
function startBackgroundTrack() {
    if (backgroundTrack) {
        return;
    }
    let backgroundUrl = `static/audio/${currentGroup}/${currentGroup}_background.mp3`;
    backgroundTrack = new Tone.Player({
        url: backgroundUrl,
        loop: true,
        autostart: false, 
        volume: bgDynamicVolume,
        onload: function() {
            console.log('background track loaded');
            if (isPlaying) {
                backgroundTrack.start();
            }
        }
    }).toDestination();
    backgroundTrack.fadeIn = bgFadeDuration / 1000; 
}

    
function highlightSelectedButton(groupName) {
    // remove active class from all buttons
    document.querySelectorAll('#groupButtons button').forEach(button => {
        button.classList.remove('active');
    });

    // add active class to the selected button
    document.getElementById(`${groupName}Button`).classList.add('active');
}

function handleAudioPlayback() {
    let tracks = getTracks(); // get the tracks based on the current language

    let squareWeights = [];
    let totalWeight = 0;

    blueSquares.forEach(square => {
        let weight = getWeight(square, dotX, dotY);
        if (weight > 0) {
            squareWeights.push({ square: square, weight: weight });
            totalWeight += weight;
        }
    });

    if (totalWeight > 0) {
        // normalize weights
        squareWeights.forEach(item => {
            item.weight /= totalWeight;
        });

        let currentPlayingSquares = squareWeights.map(item => item.square.number);

        // start or adjust tracks
        squareWeights.forEach(item => {
            let squareNumber = item.square.number;
            let weight = item.weight;
            let trackKey = `location${squareNumber}`;
            if (tracks[trackKey]) {
                if (!trackPlayers[squareNumber]) {
                    // start the track
                    trackPlayers[squareNumber] = new Tone.Player({
                        url: tracks[trackKey],
                        loop: true,
                        volume: -Infinity,
                        autostart: true
                    }).toDestination();
                }
                // adjust the volume, including tracksVolume
                let adjustedVolume = tracksVolume + Tone.gainToDb(weight);
                trackPlayers[squareNumber].volume.rampTo(adjustedVolume, 0.1);
            }
        });

        // fade out and stop tracks that are no longer needed
        playingSquares.forEach(squareNumber => {
            if (!currentPlayingSquares.includes(squareNumber)) {
                if (trackPlayers[squareNumber]) {
                    trackPlayers[squareNumber].volume.rampTo(-Infinity, 0.5);
                    // stop after fading out
                    setTimeout(() => {
                        trackPlayers[squareNumber].stop();
                        delete trackPlayers[squareNumber];
                    }, 500);
                }
            }
        });

        // update playingSquares
        playingSquares = currentPlayingSquares.slice();
    } else {
        // no squares are active, fade out all tracks
        playingSquares.forEach(squareNumber => {
            if (trackPlayers[squareNumber]) {
                trackPlayers[squareNumber].volume.rampTo(-Infinity, 0.5);
                setTimeout(() => {
                    trackPlayers[squareNumber].stop();
                    delete trackPlayers[squareNumber];
                }, 500);
            }
        });
        playingSquares = [];
    }

    // adjust background track volume based on whether other tracks are playing
    if (backgroundTrack) {
        if (playingSquares.length > 0) {
            // other tracks are playing, fade background track volume down to backgroundVolume
            backgroundTrack.volume.rampTo(backgroundVolume, bgFadeDuration / 1000);
        } else {
            // no other tracks are playing, fade background track volume up to bgDynamicVolume
            backgroundTrack.volume.rampTo(bgDynamicVolume, bgFadeDuration / 1000);
        }
    }
}

function getWeight(square, dotX, dotY) {
    // compute the distance from the red dot to the center of the square
    let centerX = square.x + square.w / 2;
    let centerY = square.y + square.h / 2;
    let dx = dotX - centerX;
    let dy = dotY - centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // maximum distance is half the diagonal of the square
    let maxDistance = Math.sqrt((square.w / 2) ** 2 + (square.h / 2) ** 2);

    // if the dot is inside the square, weight is based on proximity to center
    if (square.contains(dotX, dotY)) {
        return 1 - (distance / maxDistance);
    } else {
        return 0;
    }
}

    class DraggableSquare {
        constructor(x, y, w, h, col, number) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.col = col;
            this.number = number;
            this.dragging = false;
        }

        show() {
            p5Instance.fill(this.col);
            p5Instance.noStroke();
            p5Instance.rect(this.x, this.y, this.w, this.h);
        }

        showNumber() {
            p5Instance.fill(255, 0, 0, 100);
            p5Instance.textSize(this.w * 0.8);
            p5Instance.textAlign(p5Instance.CENTER, p5Instance.CENTER);
            p5Instance.textFont('Arial');
            p5Instance.text(this.number, this.x + this.w / 2, this.y + this.h / 2);
        }

        update(mx, my) {
            if (this.dragging) {
                this.x = mx - this.w / 2;
                this.y = my - this.h / 2;
            }
        }

        pressed(mx, my) {
            if (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h) {
                this.dragging = true;
            }
        }

        released() {
            this.dragging = false;
        }

        contains(px, py) {
            return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
        }
    }

    let sketch = function (p) {
        p5Instance = p;

        let canvasSize;
        let dotSize = 30;
        let moveW = false, moveA = false, moveS = false, moveD = false;
        let overlayImage;
        let controlPoints = [
            { imageX: 40, imageY: 39.61, latitude: 22.5560, longitude: 114.0918 },  // point 1
            { imageX: 50, imageY: 320.61, latitude: 22.5542, longitude: 114.0918 }, // point 2
            { imageX: 59, imageY: 696.61, latitude: 22.5520, longitude: 114.0918 }, // point 3
            { imageX: 370, imageY: 88.61, latitude: 22.5557, longitude: 114.0939 }, // point 4
            { imageX: 176, imageY: 167.61, latitude: 22.5551, longitude: 114.0927 }, // point 5
            { imageX: 245, imageY: 387.61, latitude: 22.5557, longitude: 114.0939 }, // point 6
            { imageX: 255, imageY: 675.61, latitude: 22.5519, longitude: 114.0933 }, // point 7
            { imageX: 678, imageY: 322.61, latitude: 22.5530, longitude: 114.0961 }, // point 8
        ];
        let { paramsLat, paramsLon } = computeBilinearParameters(controlPoints);

        p.preload = function () {
            overlayImage = null;
        };

        p.setup = function () {
            let canvasSize = Math.min(p.windowWidth, p.windowHeight) * 0.8;
            let canvas = p.createCanvas(canvasSize, canvasSize);
            canvas.parent('canvasContainer');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '2';
        
            // assign to global variables
            dotX = p.width / 2;
            dotY = p.height / 2;

            loadSquaresForCurrentGroup();
            updateTracksForCurrentGroup();

            // load the initial overlay image based on the current group
            let groupNumber = currentGroup.replace('group', '');
            let imagePath = `static/images/map/map${groupNumber}.png`;

            // load the image asynchronously
            p.loadImage(imagePath, function (img) {
                overlayImage = img;
            });

        };

        p.updateOverlayImage = function (imagePath) {
            p.loadImage(imagePath, function (img) {
                overlayImage = img;
            });
        };

        p.printSquaresData = function() {
            let squaresData = blueSquares.map(square => ({
                x: Math.round(square.x),
                y: Math.round(square.y),
                w: Math.round(square.w),
                h: Math.round(square.h),
                number: square.number
            }));
        
            console.log(`${currentGroup}: [`);
            squaresData.forEach(data => {
                console.log(`    { x: ${data.x}, y: ${data.y}, w: ${data.w}, h: ${data.h}, number: ${data.number} },`);
            });
            console.log(`],`);
        };

        
        p.draw = function () {
            p.clear();
            if (overlayImage) {
                p.image(overlayImage, 0, 0, p.width, p.height);
            }

            // compute the red dot's geographic coordinates
            let geoCoords = imageToGeo(dotX, dotY);

            // format the latitude and longitude with N/S and E/W
            let latitude = geoCoords.latitude;
            let longitude = geoCoords.longitude;

            const latDirection = latitude >= 0 ? 'N' : 'S';
            const lonDirection = longitude >= 0 ? 'E' : 'W';

            const formattedLatitude = `${Math.abs(latitude).toFixed(4)}° ${latDirection}`;
            const formattedLongitude = `${Math.abs(longitude).toFixed(4)}° ${lonDirection}`;

            // display the formatted coordinates
            latLonDisplay.innerHTML = `${formattedLatitude}, ${formattedLongitude}`;


            const step = 1;
            if (moveW) {
                dotY = p.max(dotY - step, dotSize / 2);
            }
            if (moveS) {
                dotY = p.min(dotY + step, p.height - dotSize / 2);
            }
            if (moveA) {
                dotX = p.max(dotX - step, dotSize / 2);
            }
            if (moveD) {
                dotX = p.min(dotX + step, p.width - dotSize / 2);
            }

            // draw squares in the correct order to maintain layering
            blueSquares.forEach(square => {
                square.update(p.mouseX, p.mouseY);
                square.show();
                square.showNumber();
            });

            p.fill('#cb3431');
            p.noStroke();
            p.ellipse(dotX, dotY, dotSize, dotSize);

            if (isPlaying) {
                handleAudioPlayback();
            }
        };

        p.mousePressed = function () {
            for (let i = blueSquares.length - 1; i >= 0; i--) {
                let square = blueSquares[i];
                square.pressed(p.mouseX, p.mouseY);
                if (square.dragging) {
                    // bring the selected square to the front
                    blueSquares.push(blueSquares.splice(i, 1)[0]);
                    break;
                }
            }
        };

        p.mouseReleased = function () {
            blueSquares.forEach(square => square.released());
            p.saveBlueSquares();
        };

        p.keyPressed = function () {
            if (p.key === 'w' || p.key === 'W') {
                moveW = true;
            } else if (p.key === 's' || p.key === 'S') {
                moveS = true;
            } else if (p.key === 'a' || p.key === 'A') {
                moveA = true;
            } else if (p.key === 'd' || p.key === 'D') {
                moveD = true;
            } else if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
                // delete selected square
                let draggingSquare = blueSquares.find(sq => sq.dragging);
                if (draggingSquare) {
                    blueSquares = blueSquares.filter(sq => sq !== draggingSquare);
                    // reassign numbers to maintain sequential order
                    blueSquares.forEach((square, index) => {
                        square.number = index + 1;
                    });
                    p.saveBlueSquares(); // save squares after removing
                }
            } else if (p.keyIsDown(p.UP_ARROW)) {
                // increase height
                let draggingSquare = blueSquares.find(sq => sq.dragging);
                if (draggingSquare) {
                    draggingSquare.h = p.min(draggingSquare.h + 5, 2000);
                    p.saveBlueSquares(); // save changes after resizing
                }
            } else if (p.keyIsDown(p.DOWN_ARROW)) {
                // decrease height
                let draggingSquare = blueSquares.find(sq => sq.dragging);
                if (draggingSquare) {
                    draggingSquare.h = p.max(draggingSquare.h - 5, 10);
                    p.saveBlueSquares(); // save changes after resizing
                }
            } else if (p.keyIsDown(p.LEFT_ARROW)) {
                // decrease width
                let draggingSquare = blueSquares.find(sq => sq.dragging);
                if (draggingSquare) {
                    draggingSquare.w = p.min(draggingSquare.w - 5, 2000);
                    p.saveBlueSquares(); // save changes after resizing
                }
            } else if (p.keyIsDown(p.RIGHT_ARROW)) {
                // increase width
                let draggingSquare = blueSquares.find(sq => sq.dragging);
                if (draggingSquare) {
                    draggingSquare.w = p.max(draggingSquare.w + 5, 10);
                    p.saveBlueSquares(); // save changes after resizing
                }
            } else if (p.key === 'c' || p.key === 'C') {
                p.printSquaresData();
            }
        };

        p.keyReleased = function () {
            if (p.key === 'w' || p.key === 'W') {
                moveW = false;
            } else if (p.key === 's' || p.key === 'S') {
                moveS = false;
            } else if (p.key === 'a' || p.key === 'A') {
                moveA = false;
            } else if (p.key === 'd' || p.key === 'D') {
                moveD = false;
            } else if (p.key === 'p' || p.key === 'P') {
                blueSquares.forEach(square => {
                    let topRightGeo = imageToGeo(square.x + square.w, square.y);
                    let bottomLeftGeo = imageToGeo(square.x, square.y + square.h);
                    console.log(`square${square.number}: bottom left lat: ${bottomLeftGeo.latitude.toFixed(4)}, long: ${bottomLeftGeo.longitude.toFixed(4)}, top right lat: ${topRightGeo.latitude.toFixed(4)}, long: ${topRightGeo.longitude.toFixed(4)}`);
                });
            }
        };

        p.addSquare = function() {
            let maxNumber = blueSquares.reduce((max, square) => Math.max(max, square.number), 0);
            let newNumber = maxNumber + 1;
            blueSquares.push(new DraggableSquare(150, 150, 80, 80, p.color(255, 0, 0, 100), newNumber));
            p.saveBlueSquares(); 
        };
        
        p.saveBlueSquares = function() {
            let squaresData = blueSquares.map(square => ({
                x: square.x,
                y: square.y,
                w: square.w,
                h: square.h,
                number: square.number
            }));
            localStorage.setItem(`blueSquares_${currentGroup}`, JSON.stringify(squaresData));
        };

        function computeBilinearParameters(points) {
            let N = points.length;
            if (N < 4) {
                alert('At least four control points are required for bilinear interpolation.');
                return null;
            }

            let A = [];
            let B_lat = [];
            let B_lon = [];

            for (let i = 0; i < N; i++) {
                let x = points[i].imageX;
                let y = points[i].imageY;
                let lat = points[i].latitude;
                let lon = points[i].longitude;

                // equation for latitude and longitude
                A.push([1, x, y, x * y]);
                B_lat.push(lat);
                B_lon.push(lon);
            }

            // compute the pseudo-inverse of A
            let A_mat = math.matrix(A);
            let B_lat_mat = math.matrix(B_lat);
            let B_lon_mat = math.matrix(B_lon);

            let A_pinv = math.pinv(A_mat);

            // solve for parameters: params = A_pinv * B
            let paramsLat = math.multiply(A_pinv, B_lat_mat);
            let paramsLon = math.multiply(A_pinv, B_lon_mat);

            // convert solutions to arrays
            paramsLat = paramsLat.valueOf().flat();
            paramsLon = paramsLon.valueOf().flat();

            return { paramsLat, paramsLon };
        }

        function imageToGeo(x, y) {
            let a0 = paramsLat[0], a1 = paramsLat[1], a2 = paramsLat[2], a3 = paramsLat[3];
            let b0 = paramsLon[0], b1 = paramsLon[1], b2 = paramsLon[2], b3 = paramsLon[3];

            let lat = a0 + a1 * x + a2 * y + a3 * x * y;
            let lon = b0 + b1 * x + b2 * y + b3 * x * y;

            return { latitude: lat, longitude: lon };
        }
    };

    p5Instance = new p5(sketch);

    // play button click event
    let playButton = document.getElementById('playButton');
    playButton.addEventListener('click', async function () {
        if (!isPlaying) {
            isPlaying = true;
            await userInteracted();
            startBackgroundTrack();
            playButton.src = 'static/images/pauseButton.png';
        } else {
            isPlaying = false;
            if (backgroundTrack) {
                backgroundTrack.stop();
                backgroundTrack.dispose(); 
                backgroundTrack = null;
            }
            // stop all playing tracks
            Object.values(trackPlayers).forEach(player => {
                player.stop();
            });
            trackPlayers = {};
            playingSquares = [];
            playButton.src = 'static/images/playButton.png';
        }
    });
    

   // event listener for the [+] button
   document.getElementById('addSquareButton').addEventListener('click', function() {
    p5Instance.addSquare();
});

});