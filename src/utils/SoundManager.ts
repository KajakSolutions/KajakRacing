import { soundManager as engineSoundManager } from '../engine/SoundManager';

class SoundManager {
    private initialized: boolean = false;

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

                this.initialized = true;
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
        if (this.initialized) return;

        try {
            await this.preloadSounds();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize sound manager:', error);
        }
    }

    private async preloadSounds(): Promise<void> {
        try {
            await engineSoundManager.loadSound('click', '/sounds/click.mp3', {
                category: 'sfx',
                volume: 0.5
            });

            await engineSoundManager.loadSound('hover', '/sounds/hover.mp3', {
                category: 'sfx',
                volume: 0.3
            });

            await engineSoundManager.loadSound('select', '/sounds/select.mp3', {
                category: 'sfx',
                volume: 0.7
            });

            await engineSoundManager.loadSound('back', '/sounds/back.mp3', {
                category: 'sfx',
                volume: 0.5
            });

            await engineSoundManager.loadSound('menu_music', '/sounds/menu_music.mp3', {
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
        engineSoundManager.play(id);
    }

    stop(id: string): void {
        engineSoundManager.stop(id);
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
}

export const soundManager = new SoundManager();
