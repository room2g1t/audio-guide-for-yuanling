document.addEventListener('DOMContentLoaded', function() {
    // check if an element with the id 'canvasContainer' exists in the document
    if (document.getElementById('canvasContainer')) {
        // create a new p5.js instance using instance mode
        let s = function(p) {
            let latitude, longitude; // declare latitude and longitude variables globally for use across functions

            // setup function runs once to initialize the canvas and check geolocation
            p.setup = function() {
                // create a responsive canvas inside the 'canvasContainer' element
                const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.25);
                canvas.parent('canvasContainer');
                p.textSize(window.innerHeight * 0.02); // set text size
                p.textStyle(p.BOLD); // set text style to bold
                p.fill('#000000'); 
                
                // check if the browser supports geolocation
                if (navigator.geolocation) {
                    // get the current position to request location access
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            updatePosition(position); // update the position variables
                        },
                        error => {
                            showError(error); // handle geolocation errors
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } 
                    );

                    // continuously watch for position updates
                    navigator.geolocation.watchPosition(
                        updatePosition, // update the position variables when location changes
                        showError, // handle geolocation errors
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } 
                    );
                } else {
                    // display a message if geolocation is not supported
                    p.textSize(window.innerHeight * 0.02);
                    p.fill('#34495e'); 
                    p.text('geolocation is not supported by your browser.', p.windowWidth * 0.02, p.height * 0.05);
                    console.error('geolocation is not supported by your browser.');
                }
            };

            // adjust the canvas size when the window is resized
            p.windowResized = function() {
                p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.25);
            };

            // draw function runs continuously to display information on the canvas
            p.draw = function() {
                p.clear(); // clear the canvas for the next frame
                p.textStyle(p.BOLD); // set text style to bold
                p.textAlign(p.LEFT, p.CENTER); // align text to the left

                // check if the latitude and longitude have been defined
                if (latitude !== undefined && longitude !== undefined) {
                    p.textSize(window.innerHeight * 0.03); // set text size for coordinates
                    p.fill('#000000'); 

                    // format latitude and longitude with direction indicators (n/s and e/w)
                    const latDirection = latitude >= 0 ? 'N' : 'S';
                    const lonDirection = longitude >= 0 ? 'E' : 'W';
                    const formattedLatitude = `${Math.abs(latitude).toFixed(4)}° ${latDirection}`;
                    const formattedLongitude = `${Math.abs(longitude).toFixed(4)}° ${lonDirection}`;

                    // display the formatted coordinates on the canvas
                    p.text(`${formattedLatitude}, ${formattedLongitude}`, p.windowWidth * 0.02, p.height * 0.05);
                } else {
                    // display a waiting message if gps data is not yet available
                    p.text('waiting for GPS data...', 10, p.height * 0.05);
                }
            };

            // function to update latitude and longitude variables with new data
            function updatePosition(position) {
                latitude = position.coords.latitude; // update latitude
                longitude = position.coords.longitude; // update longitude

                // store the updated coordinates in the global window object for access by other scripts
                window.latitude = latitude;
                window.longitude = longitude;

                // call a user-defined function to handle location changes, if it exists
                if (typeof window.handleLocationChange === 'function') {
                    window.handleLocationChange(latitude, longitude);
                }
            }

            // function to handle geolocation errors
            function showError(error) {
                let errorMessage; // variable to store the error message
                p.textSize(window.innerHeight * 0.03); // set text size for error messages
                p.fill('#000000');

                // determine the error message based on the error code
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

                // log the error to the console
                console.error(errorMessage);

                // display the error message in the canvas container, if it exists
                const canvasContainer = document.getElementById('canvasContainer');
                if (canvasContainer) {
                    canvasContainer.textContent = errorMessage;
                }
            }
        };

        // create a new p5.js instance using the defined sketch
        new p5(s);
    } else {
        // log a warning if the 'canvasContainer' element does not exist
        console.warn("canvasContainer not found. skipping p5.js initialization.");
    }
});
