import { soundManager as engineSoundManager } from '../engine/SoundManager';

class SoundManager {
    private initialized: boolean = false;
    private activeGameSounds: Set<string> = new Set();
    private backgroundMusic: string | null = null;

    constructor() {
        this.loadSettings();
    }

    private loadSettings(): void {
        const savedSettings = localStorage.getItem('audioSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);

                engineSoundManager.setMasterVolume(settings.masterVolume || 1.0);
                engineSoundManager.setCategoryVolume('music', settings.musicVolume || 0.5);
                engineSoundManager.setCategoryVolume('sfx', settings.sfxVolume || 1.0);

                if (settings.masterMuted) {
                    engineSoundManager.mute();
                } else {
                    engineSoundManager.unmute();
                }

            } catch (error) {
                console.error('Failed to load audio settings:', error);
            }
        }
    }

    private saveSettings(): void {
        const settings = {
            masterVolume: engineSoundManager.getMasterVolume(),
            musicVolume: engineSoundManager.getCategoryVolume('music'),
            sfxVolume: engineSoundManager.getCategoryVolume('sfx'),
            masterMuted: engineSoundManager.muted
        };

        localStorage.setItem('audioSettings', JSON.stringify(settings));
    }

    async initialize(): Promise<void> {
        console.log('Initializing sound manager1...');
        if (this.initialized) return;
        console.log('Initializing sound manager2...');

        try {
            await this.preloadSounds();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize sound manager:', error);
        }
    }

    private async preloadSounds(): Promise<void> {
        try {
            await engineSoundManager.loadSound('click', 'game/sounds/click.mp3', {
                category: 'sfx',
                volume: 0.5
            });

            await engineSoundManager.loadSound('select', 'game/sounds/select.mp3', {
                category: 'sfx',
                volume: 0.7
            });

            await engineSoundManager.loadSound('back', 'game/sounds/back.mp3', {
                category: 'sfx',
                volume: 0.5
            });

            await engineSoundManager.loadSound('menu_music', 'game/sounds/menu_music.mp3', {
                category: 'music',
                volume: 0.5,
                loop: true
            });

            console.log('Common sounds preloaded');
        } catch (error) {
            console.error('Failed to preload sounds:', error);
        }
    }

    play(id: string): void {
        if (id.includes('music')) {
            if (this.backgroundMusic && this.backgroundMusic !== id) {
                this.stop(this.backgroundMusic);
            }
            this.backgroundMusic = id;
        }

        this.activeGameSounds.add(id);

        engineSoundManager.play(id);
    }

    stop(id: string): void {
        this.activeGameSounds.delete(id);

        if (id === this.backgroundMusic) {
            this.backgroundMusic = null;
        }

        engineSoundManager.stop(id);
    }

    stopAllGameSounds(): void {
        this.activeGameSounds.forEach(soundId => {
            engineSoundManager.stop(soundId);
        });
        this.activeGameSounds.clear();
        this.backgroundMusic = null;
    }

    setMasterVolume(volume: number): void {
        engineSoundManager.setMasterVolume(volume);
        this.saveSettings();
    }

    setMusicVolume(volume: number): void {
        engineSoundManager.setCategoryVolume('music', volume);
        this.saveSettings();
    }

    setSfxVolume(volume: number): void {
        engineSoundManager.setCategoryVolume('sfx', volume);
        this.saveSettings();
    }

    mute(): void {
        engineSoundManager.mute();
        this.saveSettings();
    }

    unmute(): void {
        engineSoundManager.unmute();
        this.saveSettings();
    }

    toggleMute(): void {
        if (engineSoundManager.muted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    getMasterVolume(): number {
        return engineSoundManager.getMasterVolume();
    }

    getMusicVolume(): number {
        return engineSoundManager.getCategoryVolume('music');
    }

    getSfxVolume(): number {
        return engineSoundManager.getCategoryVolume('sfx');
    }

    isMuted(): boolean {
        return engineSoundManager.muted;
    }

    switchToGameMusic(): void {
        this.stop('menu_music');
        this.play('background_music');
    }

    switchToMenuMusic(): void {
        this.stop('background_music');
        this.play('menu_music');
    }
}

export const soundManager = new SoundManager();
