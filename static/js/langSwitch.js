const languageData = {
    english: {
        index:{
            texts:{
                title: "Audio Guide for Yuanling",
                preloadText: "Preload",
                preloadImage: "static/images/preload.png",
                testButtonText: "Test",
                groups: [
                    { 
                        name: "Melodic Encounters at Yuanling", 
                        image: "static/images/group1/group1_image1.png",
                        students:"Garnet, Christine, Coral",
                        description: "Universal Music, Urban Vibrancy, Cultural Inheritance", 
                    },
                    { 
                        name: "Young Shenzhen", 
                        image: "static/images/group2/group2_image1.jpg",
                        students:"Qian",
                        description: "Sports Atmosphere, Exercise Guidelines, Perserverance Culture",
                     },
                    { 
                        name: "Yuanling Sports", 
                        image: "static/images/group3/group3_image1.png",
                        students:"Hank",
                        description: "Playground, Childhood, Sports",
                    },
                    { 
                        name: "Voices of Yuanling: Symphony of the Times", 
                        image: "static/images/group4/group4_image1.png",
                        students:"Fred, Kara, Alan",
                        description: "Intertemporal, Developmental, Narrative, Lifelike",
                    }
                ],
                footerText: "SUSTech School fo Design, DS345, 2024",
            }
        },
        group1: {
            texts: {
                title: "Melodic Encounters at Yuanling",
                textDisplay1: "Garnet",
                textDisplay2: "Christine",
                textDisplay3: "Coral",
                locationInfo: "Location information is unavailable.",
                footerText: "SUSTech School fo Design, DS345, 2024",
                playText:{
                    play: "Play",
                    pause: "Pause"
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group1/english/group1_track1.mp3",
                    location2: "static/audio/group1/english/group1_track2.mp3",
                    location3: "static/audio/group1/english/group1_track3.mp3",
                    location4: "static/audio/group1/english/group1_track4.mp3",
                    location5: "static/audio/group1/english/group1_track5.mp3",
                    location6: "static/audio/group1/english/group1_track6.mp3",
                }
            }
        },
        group2: {
            texts: {
                title: "Young Shenzhen",
                textDisplay1: "Qian",
                locationInfo: "Location information is unavailable.",
                footerText: "SUSTech School fo Design, DS345, 2024",
                playText:{
                    play: "Play",
                    pause: "Pause"
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group2/english/group2_track1.mp3",
                    location2: "static/audio/group2/english/group2_track2.mp3",
                    location3: "static/audio/group2/english/group2_track3.mp3",
                    location4: "static/audio/group2/english/group2_track4.mp3",
                    location5: "static/audio/group2/english/group2_track5.mp3",
                    location6: "static/audio/group2/english/group2_track6.mp3",
                }
            }
        },
        group3: {
            texts: {
                title: "Yuanling Sports",
                textDisplay1: "Hank",
                locationInfo: "Location information is unavailable.",
                footerText: "SUSTech School fo Design, DS345, 2024",
                playText:{
                    play: "Play",
                    pause: "Pause"
                }
            },
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
        group4: {
            texts: {
                title: "Voices of Yuanling: Symphony of the Times",
                textDisplay1: "Fred",
                textDisplay2: "Kara",
                textDisplay3: "Alan",
                locationInfo: "Location information is unavailable.",
                footerText: "SUSTech School fo Design, DS345, 2024",
                playText:{
                    play: "Play",
                    pause: "Pause"
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group4/english/group4_track1.mp3",
                    location2: "static/audio/group4/english/group4_track2.mp3",
                    location3: "static/audio/group4/english/group4_track3.mp3",
                    location4: "static/audio/group4/english/group4_track4.mp3",
                    location5: "static/audio/group4/english/group4_track5.mp3",
                    location6: "static/audio/group4/english/group4_track6.mp3",
                }
            }
        },
        testing: {
            texts: {
                title: "testing",
                footerText: "SUSTech School fo Design, DS345, 2024",
                volumeLabels: {
                    background: "Background:",
                    tracks: "Tracks:"
                },
            },
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
    },
    chinese: {
        index:{
            texts:{
                title: "园岭街音频导览",
                preloadText: "加载音频",
                preloadImage: "static/images/preload.png",
                testButtonText: "测试",
                groups: [
                    { 
                        name: "声遇园岭", 
                        image: "static/images/group1/group1_image1.png",
                        students:"宫喜, 汪昱岑, 徐羽萱",
                        description: "音乐无界，城市活力，文化传承", 
                    },
                    { 
                        name: "童心深圳", 
                        image: "static/images/group2/group2_image1.jpg",
                        students:"许跃骞",
                        description: "年龄，文化，语言，生活", 
                    },
                    { 
                        name: "园岭，体育，深圳人这一生", 
                        image: "static/images/group3/group3_image1.png",
                        students:"吴业青",
                        description: "运动氛围，锻炼指引，拼搏文化", 
                    },
                    { 
                        name: "园岭之声：时代交响", 
                        image: "static/images/group4/group4_image1.png",
                        students:"杨熙楠，牛文可，许可",
                        description: "跨时空，发展， 叙事性，生活化", 
                     }
                ],
                footerText: "南方科技大学创新创意设计学院, DS345, 2024", 
            }
        },
        group1: {
            texts: {
                title: "声遇园岭",
                textDisplay1: "宫喜",
                textDisplay2: "汪昱岑",
                textDisplay3: "徐羽萱",
                locationInfo: "无法获取位置信息。",
                footerText: "南方科技大学创新创意设计学院, DS345, 2024", 
                playText:{
                    play: "播放",
                    pause: "暂停 "
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group1/chinese/group1_track1.mp3",
                    location2: "static/audio/group1/chinese/group1_track2.mp3",
                    location3: "static/audio/group1/chinese/group1_track3.mp3",
                    location4: "static/audio/group1/chinese/group1_track4.mp3",
                    location5: "static/audio/group1/chinese/group1_track5.mp3",
                    location6: "static/audio/group1/chinese/group1_track6.mp3",
                }
            }
        },
        group2: {
            texts: {
                title: "童心深圳",
                textDisplay1: "许跃骞",
                locationInfo: "无法获取位置信息。",
                footerText: "南方科技大学创新创意设计学院, DS345, 2024", 
                playText:{
                    play: "播放",
                    pause: "暂停 "
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group2/chinese/group2_track1.mp3",
                    location2: "static/audio/group2/chinese/group2_track2.mp3",
                    location3: "static/audio/group2/chinese/group2_track3.mp3",
                    location4: "static/audio/group2/chinese/group2_track4.mp3",
                    location5: "static/audio/group2/chinese/group2_track5.mp3",
                    location6: "static/audio/group2/chinese/group2_track6.mp3",
                }
            }
        },
        group3: {
            texts: {
                title: "园岭，体育，深圳人这一生",
                textDisplay1: "吴业青",
                locationInfo: "无法获取位置信息。",
                footerText: "南方科技大学创新创意设计学院, DS345, 2024", 
                playText:{
                    play: "播放",
                    pause: "暂停 "
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group3/chinese/group3_track1.mp3",
                    location2: "static/audio/group3/chinese/group3_track2.mp3",
                    location3: "static/audio/group3/chinese/group3_track3.mp3",
                    location4: "static/audio/group3/chinese/group3_track4.mp3",
                    location5: "static/audio/group3/chinese/group3_track5.mp3",
                    location6: "static/audio/group3/chinese/group3_track6.mp3",
                }
            }
        },
        group4: {
            texts: {
                title: "园岭之声：时代交响",
                textDisplay1: "杨熙楠",
                textDisplay2: "牛文可",
                textDisplay3: "许可",
                locationInfo: "无法获取位置信息。",
                footerText: "南方科技大学创新创意设计学院, DS345, 2024", 
                playText:{
                    play: "播放",
                    pause: "暂停 "
                }
            },
            audio: {
                tracks: {
                    location1: "static/audio/group4/chinese/group4_track1.mp3",
                    location2: "static/audio/group4/chinese/group4_track2.mp3",
                    location3: "static/audio/group4/chinese/group4_track3.mp3",
                    location4: "static/audio/group4/chinese/group4_track4.mp3",
                    location5: "static/audio/group4/chinese/group4_track5.mp3",
                    location6: "static/audio/group4/chinese/group4_track6.mp3",
                }
            }
        },
        testing: {
            texts: {
                title: "测试界面",
                footerText: "南方科技大学创新创意设计学院, DS345, 2024",
                volumeLabels: {
                    background: "背景声:",
                    tracks: "其他声音:"
                },
            },
            audio: {
                tracks: {
                    location1: "static/audio/group3/chinese/group3_track1.mp3",
                    location2: "static/audio/group3/chinese/group3_track2.mp3",
                    location3: "static/audio/group3/chinese/group3_track3.mp3",
                    location4: "static/audio/group3/chinese/group3_track4.mp3",
                    location5: "static/audio/group3/chinese/group3_track5.mp3",
                    location6: "static/audio/group3/chinese/group3_track6.mp3",
                }
            }
        },
    }
};

let currentLanguage = localStorage.getItem('appLanguage') || 'english';
let currentPage = document.body.dataset.page; // get current page

// update in updateTextAndAudio function

function updateTextAndAudio() {
    // check if currentPage is defined in languageData
    const pageData = languageData[currentLanguage][currentPage];
    if (!pageData || !pageData.texts) {
        console.error(`No data found for ${currentPage} in ${currentLanguage}`);
        return; 
    }

    const texts = pageData.texts; // access texts for the current page

    document.title = texts.title; // update the page title

    // update group-specific text displays
    const textDisplay1 = document.getElementById('textDisplay1');
    const textDisplay2 = document.getElementById('textDisplay2');
    const textDisplay3 = document.getElementById('textDisplay3');
    const locationInfo = document.getElementById('locationInfo');

    if (textDisplay1) textDisplay1.textContent = texts.textDisplay1;
    if (textDisplay2) textDisplay2.textContent = texts.textDisplay2;
    if (textDisplay3) textDisplay3.textContent = texts.textDisplay3;
    if (locationInfo) locationInfo.textContent = texts.locationInfo;
    
    const preloadIcon = document.getElementById('preloadIcon');
    if (preloadIcon) {
        preloadIcon.textContent = ''; // clear previous content

        // create and set the preload button image
        const preloadImage = document.createElement('img');
        preloadImage.src = texts.preloadImage; // use the image path from languageData
        preloadImage.alt = 'Preload Icon';
        preloadImage.className = 'preload-image';

        // append the image and text to the button
        preloadIcon.appendChild(preloadImage);
        const preloadTextNode = document.createTextNode(texts.preloadText);
        preloadIcon.appendChild(preloadTextNode);
    }

    const groupTitle = document.querySelector('h1'); 
    if (groupTitle) {
        groupTitle.textContent = texts.title; // update with the group title
    }

    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.textContent = texts.testButtonText; // update test button text
    }

    const footerText = document.querySelector('.body-foot .foot-bottom');
    if (footerText) {
        footerText.textContent = texts.footerText; // update footer text
    }

    const playTextElement = document.querySelector('.play-text');
    if (playTextElement) {
        const isPlaying = window.isPlaying || false; 
        const playText = texts.playText;
        if (playText) {
            playTextElement.textContent = isPlaying ? playText.pause : playText.play;
        }
    }

    const backgroundVolumeLabel = document.querySelector('label[for="backgroundVolume"]');
    const tracksVolumeLabel = document.querySelector('label[for="tracksVolume"]');
    
    if (backgroundVolumeLabel) {
        backgroundVolumeLabel.textContent = texts.volumeLabels.background;
    }
    if (tracksVolumeLabel) {
        tracksVolumeLabel.textContent = texts.volumeLabels.tracks;
    }
    // update group links
    const navigation = document.getElementById('navigation');
    if (navigation) {
        navigation.innerHTML = ''; // clear existing content

        // check if groups exist
        const groups = texts.groups;
        if (groups && Array.isArray(groups)) {
            groups.forEach((group, index) => {
                const groupLink = document.createElement('a');
                groupLink.href = `group${index + 1}.html`;
                groupLink.className = 'group-link';

                const groupContainer = document.createElement('div');
                groupContainer.className = 'group-container';

                const img = document.createElement('img');
                img.src = group.image;
                img.alt = `${group.name} image`;
                img.className = 'group-image';

                const groupContent = document.createElement('div');
                groupContent.className = 'group-content';
                groupContent.textContent = group.name;


                // create a heading for the group name
                const groupStudents = document.createElement('h2');
                groupStudents.className = 'group-students';
                groupStudents.textContent = group.students;

                // create a paragraph for the description
                const groupDescription = document.createElement('p');
                groupDescription.className = 'group-description';
                groupDescription.textContent = group.description;

                // append the name and description to the groupContent
                groupContent.appendChild(groupStudents);
                groupContent.appendChild(groupDescription);

                groupContainer.appendChild(img);
                groupContainer.appendChild(groupContent);
                groupLink.appendChild(groupContainer);
                navigation.appendChild(groupLink);
            });
        } else {
            console.error(`No groups found for ${currentPage} in ${currentLanguage}`);
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    updateTextAndAudio(); // update the UI based on the current language and page

    const toggleButton = document.getElementById('languageToggleButton');
    const languageIcon = document.getElementById('languageIcon'); // get the language icon element

    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            currentLanguage = currentLanguage === 'english' ? 'chinese' : 'english';
            localStorage.setItem('appLanguage', currentLanguage);
            updateTextAndAudio(); // update the UI after changing language

            // update the language icon based on the current language
            if (currentLanguage === 'english') {
                languageIcon.src = 'static/images/switchEN.png'; 
            } else {
                languageIcon.src = 'static/images/switchCN.png'; 
            }
        });
    }
});