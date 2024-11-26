document.addEventListener('DOMContentLoaded', function() {
    // check if 'canvasContainer' element exists
    if (document.getElementById('canvasContainer')) {
        // p5.js instance mode
        let s = function(p) {
            let latitude, longitude; // define globally for use across functions

            p.setup = function() {
                // create the canvas for displaying GPS data
                const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.25);
                canvas.parent('canvasContainer');
                p.textSize(window.innerHeight * 0.02);
                p.textStyle(p.BOLD);
                p.fill('#34495e');

                // check if geolocation is available in the browser
                if (navigator.geolocation) {
                    // request current position to prompt for permissions
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            updatePosition(position);
                        },
                        error => {
                            showError(error);
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                    );

                    // watch position for changes
                    navigator.geolocation.watchPosition(
                        updatePosition,
                        showError,
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                    );
                } else {
                    p.textSize(window.innerHeight * 0.02);
                    p.fill('#34495e');
                    p.text('geolocation is not supported by your browser.',p.windowWidth * 0.02, p.height * 0.05);
                    console.error('geolocation is not supported by your browser.');
                }
            };

            p.windowResized = function() {
                p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.25);
            };

            p.draw = function() {
                p.clear();
                p.textStyle(p.BOLD);
                p.textAlign(p.LEFT, p.CENTER);

                // display the current GPS coordinates
                if (latitude !== undefined && longitude !== undefined) {
                    p.textSize(window.innerHeight * 0.03);
                    p.fill('#34495e');
                    const latDirection = latitude >= 0 ? 'N' : 'S';
                    const lonDirection = longitude >= 0 ? 'E' : 'W';
                    
                    const formattedLatitude = `${Math.abs(latitude).toFixed(4)}° ${latDirection}`;
                    const formattedLongitude = `${Math.abs(longitude).toFixed(4)}° ${lonDirection}`;
                    p.text(`${formattedLatitude}, ${formattedLongitude}`, p.windowWidth * 0.02, p.height * 0.05);
                } else {
                    p.text('waiting for GPS data...', 10, p.height * 0.05);
                }
            };

            // callback function to update the position variables
            function updatePosition(position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                // store current position in the global window object
                window.latitude = latitude;
                window.longitude = longitude;

                // call handleLocationChange if it's defined
                if (typeof window.handleLocationChange === 'function') {
                    window.handleLocationChange(latitude, longitude);
                }
            }

            // error handling function
            function showError(error) {
                let errorMessage;
                p.textSize(window.innerHeight * 0.03);
                p.fill('#34495e');
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'geolocation permission denied. please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'the request to get user location timed out.';
                        break;
                    default:
                        errorMessage = 'an unknown error occurred.';
                        break;
                }

                console.error(errorMessage);
                const canvasContainer = document.getElementById('canvasContainer');
                if (canvasContainer) {
                    canvasContainer.textContent = errorMessage; // display error on the page
                }
            }
        };

        // create a new p5 instance
        new p5(s);
    } else {
        // 'canvasContainer' does not exist; skip initializing p5.js
        console.warn("canvasContainer not found. Skipping p5.js initialization.");
    }
});
