class SoundManager {
    constructor() {
        this.sounds = {
            click: new Audio('/assets/audio/click.mp3'),
            spin: new Audio('/assets/audio/spin.mp3'),
            win: new Audio('/assets/audio/win.mp3'),
            legendary: new Audio('/assets/audio/legendary.mp3')
        };

        // Preload sounds
        Object.values(this.sounds).forEach(sound => {
            sound.load();
            sound.volume = 0.5; // Default volume
        });
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Reset to start
            sound.play().catch(e => console.error("Audio play failed:", e));
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
}

const soundManager = new SoundManager();
export default soundManager;
