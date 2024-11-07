This audio guide prototype for YuanLing Street includes a step-by-step tutorial on uploading your work to the application. To start using this project, you need to create your own copy by forking the repository. To do this, click the “Fork” button at the top right corner of this page. This will create a personal copy of the repository under your own GitHub account. You can then clone your fork to your local machine to begin working on it. Remember, any changes you push to your forked repository won’t affect the original project, so feel free to experiment! Use different branches for different groups.

### Development Guide ###

**1. Upload your audio files**

Inside 'static', you could upload your sound design files to 'audio'. As an example, when you upload 'group1_track1.mp3', it needs to be preloaded in the home page. To acheive that, add the files inside preLoad.js as follows:

    const audioFiles = [
        "static/audio/group1/english/group1_track1.mp3",
         // add more below...   
    ];

If you have more than 6 tracks, simply follow the format as above, and also navigate to langSwitch.js, find your group(use group1 as an example here), in the english section, add it as follows:

    group1: {
        audio: {
            tracks: {
                // previous tracks...
                location6: "static/audio/group1/english/group1_track7.mp3",
                
            }
        }
    },

After that, scroll down and repeat it again in chinese section.

**2. Update group name and your names**

Because this app has two languages, in langSwitch.js, you will need to update the text in both english and chinese. Similar as above, firstly find your group, and then update the title, and your name(in english first):

        group1: {
            texts: {
                title: "group1",
                textDisplay1: "Name 1",
                textDisplay2: "Name 2",
                textDisplay3: "Name 3",
            },
        }

After that, scroll down and update the group name(or, project name) and your team members name in chinese.

**3. Define your location**

To define your specific location, modify the code in handleLocationChange function within playFiles.js:    
    
    if (latitude > 22 && latitude < 23 && longitude > 113 && longitude < 114) {
        playTrack(tracks["location1"], "location1");        
    } else if (latitude > 23 && latitude < 24 && longitude > 114 && longitude < 115) {
        playTrack(tracks["location2"], "location2");        
    } else if (...){
            ...        
    }

**4. Adjust the fade in and fade out**

To adjust the fade in and fade out of your tracks, navigate to the top of playFiles.js and edit the code below:

    let fadeInDuration = 2000; // millisecond, adjust as needed
    let fadeOutDuration = 2000; // millisecond, adjust as needed

**5. Adjust the track volume**

To adjust the background track volume and other track volume, update the number in functions below (inside playFiles):

    function startBackgroundTrack() {
        const backgroundFile = "static/audio/group1/group1_background1.mp3";
        loadAndPlayAudio(backgroundFile, true, true, function(player) {
            backgroundTrack = player;
            console.log("background track started.");
        });
        backgroundTrack.volume.value = -12; // set the background track volume here
    }

for other tracks, change here:

    function loadAndPlayAudio(file, loop = true, fadeIn = false, callback, volume = -12)
    
**6. Upload your images**

To upload your own group image, simply swap the image inside image folder. Note: please keep the name of your image as image1-4, following your group number. In the index page, the image is group1_image1, in your own group page, it's group1_image2.


### Testing Page Guide ###

The testing page provides a comprehensive overview of how your project will sound in action. The red dot represents the user, and its pseudo-geolocation is displayed below the map as it moves. Red squares indicate locations that trigger different soundtracks, with each square linked to its corresponding track. For example, entering square 1 will play track 1. Below are detailed instructions on how to use the testing page.

1. Use WASD on your keyboard to move the red dot.
2. To test with different versions of sound files(english/ chinese), press the EN/中 at top right, and then refresh. After that, press play again and the switched audio files should be playing from begin.
2. Use the add button to create a new square, and when holding the square and press delete on your keyboard, the selected square will be deleted. Squares can be drag and moved with mouse.
3. Press 'p' or 'P' on your keyboard to print the geo location of all the squares, which you could use to set the range in playFiles accordingly.
4. To test with your sound files, update the file name inside langSwitch.js: 

        testing: {
            audio: {
                tracks: {
                    location1: "static/audio/group3/english/group3_track1.mp3",
                    location2: "static/audio/group3/english/group3_track2.mp3",
                    location3: "static/audio/group3/english/group3_track3.mp3",
                    location4: "static/audio/group3/english/group3_track4.mp3",
                    location5: "static/audio/group3/english/group3_track5.mp3",
                    location6: "static/audio/group3/english/group3_track6.mp3",
                }
            }
        },

To update the background track, go to testing.js and update the url inside the startBackgroundTrack() function:
    
        function startBackgroundTrack() {
            backgroundTrack = new Tone.Player({
                url: 'static/audio/group1/group1_background1.mp3',
                // rest of the code...
            })
        }

5. To update the dynamic background track volume and fadeIn/out, in testing.js, edit:

        let bgFadeDuration = 2000; // dynamic fade in/out duration in seconds
        let bgDynamicVolume = -3;

### To Do ###


~~1. Two versions of tracks, have a button to switch between chinese and english version of voices.~~


~~2. Dynamic background track volume: background track volume goes up when no front tracks are playing.~~


~~3. Have four buttons on the testing page to switch between 4 groups.~~

~~4. Update group page UI design.~~


© Hao ZHENG, Marcel SAGESSER, SUSTech School of Design, 2024
