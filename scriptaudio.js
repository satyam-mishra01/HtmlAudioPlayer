let playlist = [];
let currentIndex = 0;

// Load playlist from localStorage on page load
window.onload = function () {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (storedPlaylist) {
        playlist = storedPlaylist;
        updatePlaylist();
    }

    const storedIndex = parseInt(localStorage.getItem('currentIndex'));
    if (!isNaN(storedIndex) && storedIndex >= 0 && storedIndex < playlist.length) {
        currentIndex = storedIndex;
        playAudio();
    }
};

function loadAudio(input) {
    const file = input.files[0];
    const audioPlayer = document.getElementById('audioPlayer');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const audioURL = event.target.result;
            audioPlayer.src = audioURL;

            // Save the file data to the playlist
            playlist.push({ name: file.name, dataURL: audioURL, lastTime: 0 });
            updatePlaylist();

            // Save playlist to localStorage
            localStorage.setItem('playlist', JSON.stringify(playlist));
        };

        reader.readAsDataURL(file);
    }
}

function updatePlaylist() {
    const playlistContainer = document.getElementById('playlist');
    playlistContainer.innerHTML = '';

    playlist.forEach((audio, index) => {
        const audioItem = document.createElement('div');
        audioItem.className = 'playlist-song'
        console.log("audio", audio);
        console.log("audioItem", audioItem);

        audioItem.className = 'audio-item';
        audioItem.textContent = audio.name;

        audioItem.addEventListener('click', () => {
            currentIndex = index;
            playAudio();
        });

        playlistContainer.appendChild(audioItem);
    });
}

function playAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentAudio = playlist[currentIndex];

    if (currentAudio) {
        audioPlayer.src = currentAudio.dataURL;
        audioPlayer.currentTime = currentAudio.lastTime;
        audioPlayer.play();
    }

    // Save currentIndex to localStorage
    localStorage.setItem('currentIndex', currentIndex);
}

function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    playAudio();
}

function playPrev() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playAudio();
}

document.addEventListener('beforeunload', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentAudio = playlist[currentIndex];

    if (currentAudio) {
        currentAudio.lastTime = audioPlayer.currentTime;

        // Save playlist to localStorage
        localStorage.setItem('playlist', JSON.stringify(playlist));
    }
});
