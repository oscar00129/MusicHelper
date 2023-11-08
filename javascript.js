const app = Vue.createApp({
    data() {
        return {
            audioPlayer: {
                volume: 0.05,
                src: '',
                currentTime: '00:00:00',
                songDuration: '00:00:00',
                songName: '',
                status: {
                    playing: false,
                    loaded: false
                }
            },
            skipInterval: 5 // Seconds
        }
    },
    created() {
        document.addEventListener('keydown', this.keyDownHandler);
    },
    mounted() {
        this.changeAudioPlayerVolume();
    },
    destroyed() {
        document.removeEventListener('keyup', this.keyDownHandler);
    },
    methods: {
        fileSelected(event) {
            file = event.target.files[0];
            if(file) this.changeAudioPlayerSong(file);
        },
        changeAudioPlayerSong(file) {
            this.audioPlayer.songName = file.name;
            let fileSelected = URL.createObjectURL(file);
            this.audioPlayer.src = fileSelected;
            this.$refs.audioPlayer.src = this.audioPlayer.src;
            document.activeElement.blur();
        },
        changeAudioPlayerVolume() {
            this.$refs.audioPlayer.volume = this.audioPlayer.volume;
        },
        changeAudioPlayerCurrentTime() {
            this.$refs.audioPlayer.currentTime = this.formatTimeToSeconds(this.audioPlayer.currentTime);
        },
        rngTimeSongChanged(evt) {
            // TODO: Resolve bug, when the song ends and you change the position, song doesnt play. 
            let newPos = evt.target.value;
            this.audioPlayer.currentTime = this.secondsToFormatTime(newPos);
            this.changeAudioPlayerCurrentTime();
        },
        rngVolumeChanged(evt) {
            let volume = evt.target.value;
            this.audioPlayer.volume = volume;
            this.changeAudioPlayerVolume();
        },
        loadedSong() {
            this.audioPlayer.songDuration = this.secondsToFormatTime(this.$refs.audioPlayer.duration);
            this.audioPlayer.status.playing = true;
            this.audioPlayer.status.loaded = true;
        },
        playingAudio() {
            this.audioPlayer.currentTime = this.secondsToFormatTime(this.$refs.audioPlayer.currentTime);
        },
        keyDownHandler(event) {
            console.log(event.code);
            if(event.key == "ArrowRight"){
                this.btnSkip(this.skipInterval);
            }else if(event.key == "ArrowLeft"){
                this.btnSkip(-1 * this.skipInterval);
            }else if(event.code == "Space"){
                this.btnPlayPauseClick();
            }
        },
        btnPlayPauseClick(){
            if(!this.audioPlayer.status.loaded) return;
            this.audioPlayer.status.playing = !this.audioPlayer.status.playing;
        },
        btnSkip(interval){
            if(!this.audioPlayer.status.loaded) return;
            let currentSeconds = this.formatTimeToSeconds(this.audioPlayer.currentTime);
            currentSeconds = currentSeconds + interval;
            this.audioPlayer.currentTime = this.secondsToFormatTime(currentSeconds);
            this.changeAudioPlayerCurrentTime();
        },
        secondsToFormatTime(totalSeconds) {
            // Convert seconds to format time
            // Example: 300.04245 to 00:05:00
            // Example: 231.647914 to 00:03:51
            // Example: 9498.493979 to 02:38:18
            var hours = parseInt(totalSeconds / 3600);
            var minutes = parseInt((totalSeconds - (hours * 3600)) / 60);
            var seconds = parseInt(totalSeconds - ((hours * 3600) + (minutes * 60)));

            return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
        },
        formatTimeToSeconds(time) {
            // Convert seconds to format time
            // Example: 00:05:00 to 300.04245
            // Example: 00:03:51 to 231.647914
            // Example: 02:38:18 to 9498.493979
            const digits = time.split(":");
            var hours = digits[0];
            var minutes = digits[1];
            var seconds = digits[2];
            var totalSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
            return totalSeconds;
        }
    },
    watch: {
        'audioPlayer.status.playing'(playing){
            if(playing){
                this.$refs.audioPlayer.play();
            }else{
                this.$refs.audioPlayer.pause();
            }
        }
    }
});
app.mount('#app');