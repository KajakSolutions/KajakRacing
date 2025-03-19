interface Sound {
    audio: HTMLAudioElement;
    category: 'music' | 'sfx';
    volume: number;
}

class SoundManager {
    private sounds: Map<string, Sound> = new Map();
    private musicVolume: number = 0.5; 
    private sfxVolume: number = 1.0;   
    private masterVolume: number = 1.0; 
    private isMuted: boolean = false;

    constructor() {
        
        this.loadSettings();

        
        this.loadSound('background_music', '/sounds/background_music.mp3', {
            category: 'music',
            loop: true,
            autoplay: false
        });
    }

    private loadSettings(): void {
        const savedSettings = localStorage.getItem("audioSettings");
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.musicVolume = settings.musicVolume / 100;
            this.sfxVolume = settings.sfxVolume / 100;
            this.isMuted = settings.musicMuted || settings.sfxMuted;
        }
    }

    public loadSound(
        id: string,
        src: string,
        options: {
            category: 'music' | 'sfx';
            loop?: boolean;
            autoplay?: boolean;
        }
    ): void {
        const audio = new Audio(src);

        if (options.loop) {
            audio.loop = true;
        }

        if (options.autoplay) {
            audio.autoplay = true;
        }

        
        const volume = options.category === 'music' ? this.musicVolume : this.sfxVolume;
        audio.volume = volume * this.masterVolume;

        this.sounds.set(id, {
            audio,
            category: options.category,
            volume
        });
    }

    public play(id: string): void {
        const sound = this.sounds.get(id);
        if (!sound || this.isMuted) return;

        
        sound.audio.currentTime = 0;
        sound.audio.play().catch(error => {
            console.warn(`Failed to play sound ${id}:`, error);
        });
    }

    public stop(id: string): void {
        const sound = this.sounds.get(id);
        if (!sound) return;

        sound.audio.pause();
        sound.audio.currentTime = 0;
    }

    public pause(id: string): void {
        const sound = this.sounds.get(id);
        if (!sound) return;

        sound.audio.pause();
    }

    public resume(id: string): void {
        const sound = this.sounds.get(id);
        if (!sound || this.isMuted) return;

        sound.audio.play().catch(error => {
            console.warn(`Failed to resume sound ${id}:`, error);
        });
    }

    public setMusicVolume(volume: number): void {
        this.musicVolume = volume;

        
        this.sounds.forEach(sound => {
            if (sound.category === 'music') {
                sound.volume = volume;
                sound.audio.volume = volume * this.masterVolume;
            }
        });
    }

    public setSfxVolume(volume: number): void {
        this.sfxVolume = volume;

        
        this.sounds.forEach(sound => {
            if (sound.category === 'sfx') {
                sound.volume = volume;
                sound.audio.volume = volume * this.masterVolume;
            }
        });
    }

    public setMasterVolume(volume: number): void {
        this.masterVolume = volume;

        
        this.sounds.forEach(sound => {
            sound.audio.volume = sound.volume * this.masterVolume;
        });
    }

    public mute(): void {
        this.isMuted = true;

        
        this.sounds.forEach(sound => {
            sound.audio.pause();
        });
    }

    public unmute(): void {
        this.isMuted = false;

        
        const backgroundMusic = this.sounds.get('background_music');
        if (backgroundMusic) {
            backgroundMusic.audio.play().catch(error => {
                console.warn('Failed to play background music:', error);
            });
        }
    }

    public playNitroSound(): void {
        
        
        if (!this.sounds.has('nitro')) {
            this.loadSound('nitro', '/sounds/nitro.mp3', { category: 'sfx' });
        }

        this.play('nitro');
    }

    public playCollisionSound(): void {
        
        
        if (!this.sounds.has('collision')) {
            this.loadSound('collision', '/sounds/collision.mp3', { category: 'sfx' });
        }

        this.play('collision');
    }

    public playEngineSound(revLevel: number): void {
        
        
        if (!this.sounds.has('engine')) {
            this.loadSound('engine', '/sounds/engine.mp3', {
                category: 'sfx',
                loop: true
            });
        }

        const engineSound = this.sounds.get('engine');
        if (engineSound) {
            
            engineSound.audio.playbackRate = 0.8 + (revLevel * 0.7);

            
            if (engineSound.audio.paused && !this.isMuted) {
                engineSound.audio.play().catch(error => {
                    console.warn('Failed to play engine sound:', error);
                });
            }
        }
    }

    public stopEngineSound(): void {
        this.stop('engine');
    }
}


export const soundManager = new SoundManager();
