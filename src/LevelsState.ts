import * as Phaser from "phaser";
import { EGAProgressionStatus, GameAnalytics } from 'gameanalytics';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "LevelsState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class LevelsState extends Phaser.Scene {
  private sfxMusic!: Phaser.Sound.BaseSound;

  private musicOn: boolean;

  private lfbWon: boolean = false;

  private yaplaWon: boolean = false;

  private klsWon: boolean = false;

  private blankWon: boolean = false;

  private buttonSoundOn: Phaser.GameObjects.Sprite;

  private buttonSoundOff: Phaser.GameObjects.Sprite;

  public constructor() {
    super(sceneConfig);
  }

  public init({ musicOn, lfbWon, yaplaWon, klsWon, blankWon }: { musicOn: boolean, lfbWon: boolean, yaplaWon: boolean, klsWon: boolean, blankWon: boolean }): void {
    this.musicOn = musicOn;
    this.lfbWon = lfbWon;
    this.yaplaWon = yaplaWon;
    this.klsWon = klsWon;
    this.blankWon = blankWon;
  }

  public create(): void {
    // Background
    this.add.image(550 / 2, 400 / 2, "img_background");

    // Title
    this.add.image(550 / 2, 100, "img_levels_title");

    // LFB level button
    const buttonPlayLFB = this.add.sprite(550 / 2, 170, "img_button_play_LFB");
    buttonPlayLFB.setInteractive({ useHandCursor: true });
    buttonPlayLFB.on("pointerdown", () => this.startLFBGameState(), this);
    const checkLFB = this.add.sprite(450, 170, "check");
    if (this.lfbWon) {
      checkLFB.visible = true;
    } else {
      checkLFB.visible = false;
    }

    // Yapla level button
    const buttonPlayYAPLA = this.add.sprite(550 / 2, 215, "img_button_play_YAPLA");
    buttonPlayYAPLA.setInteractive({ useHandCursor: true });
    buttonPlayYAPLA.on("pointerdown", () => this.startYAPLAGameState(), this);
    const checkYAPLA = this.add.sprite(450, 215, "check");
    if (this.yaplaWon) {
      checkYAPLA.visible = true;
    } else {
      checkYAPLA.visible = false;
    }

    // KLS level button
    const buttonPlayKLS = this.add.sprite(550 / 2, 260, "img_button_play_KLS");
    buttonPlayKLS.setInteractive({ useHandCursor: true });
    buttonPlayKLS.on("pointerdown", () => this.startKLSGameState(), this);
    const checkKLS = this.add.sprite(450, 260, "check");
    if (this.klsWon) {
      checkKLS.visible = true;
    } else {
      checkKLS.visible = false;
    }

    // BLANK level button
    const buttonPlayBLANK = this.add.sprite(550 / 2, 305, "img_button_play_BLANK");
    buttonPlayBLANK.setInteractive({ useHandCursor: true });
    buttonPlayBLANK.on("pointerdown", () => this.startBLANKGameState(), this);
    const checkBLANK = this.add.sprite(450, 305, "check");
    if (this.blankWon) {
      checkBLANK.visible = true;
    } else {
      checkBLANK.visible = false;
    }


    if ( this.lfbWon && this.yaplaWon && this.klsWon && this.blankWon) {
      // Videos button
      const buttonSeeVideos = this.add.sprite(550 / 2, 355, "img_button_videos");
      buttonSeeVideos.setInteractive({ useHandCursor: true });
      buttonSeeVideos.on("pointerdown", () => this.startVideoSelectState(), this);
    }

    // Sound button
    this.buttonSoundOn = this.add.sprite(480, 30, "sound_on");
    this.buttonSoundOn.setInteractive({ useHandCursor: true });
    this.buttonSoundOn.on("pointerdown", () => this.toggleAudio(), this);

    this.buttonSoundOff = this.add.sprite(480, 30, "sound_off");
    this.buttonSoundOff.setInteractive({ useHandCursor: true });
    this.buttonSoundOff.on("pointerdown", () => this.toggleAudio(), this);

    if (this.musicOn) {
      this.buttonSoundOn.visible = true;
      this.buttonSoundOff.visible = false;
    } else {
      this.buttonSoundOff.visible = true;
      this.buttonSoundOn.visible = false;
    }

    this.initAudio();
  }

  private startVideoSelectState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("VideoSelectState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startLFBGameState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, "lfb");
      this.scene.start("LFBGameState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startYAPLAGameState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, "yapla");
      this.scene.start("YAPLAGameState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startKLSGameState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, "kls");
      this.scene.start("KLSGameState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startBLANKGameState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, "blank");
      this.scene.start("BLANKGameState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private initAudio(): void {
    // Audio
    this.sfxMusic = this.sound.add("music_levels");
    this.sfxMusic.play();
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      if (this.musicOn) {
        this.sfxMusic.mute = false;
      } else {
        this.sfxMusic.mute = true;
      }
      this.sfxMusic.setLoop(true);
    }
  }

  private toggleAudio(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      if (this.musicOn) {
        this.sfxMusic.mute = true;
        this.musicOn = false;
        if (this.buttonSoundOn instanceof Phaser.GameObjects.Sprite) {
          this.buttonSoundOn.visible = false;
        }
        if (this.buttonSoundOff instanceof Phaser.GameObjects.Sprite) {
          this.buttonSoundOff.visible = true;
        }
      } else {
        this.sfxMusic.mute = false;
        this.musicOn = true;
        if (this.buttonSoundOn instanceof Phaser.GameObjects.Sprite) {
          this.buttonSoundOn.visible = true;
        }
        if (this.buttonSoundOff instanceof Phaser.GameObjects.Sprite) {
          this.buttonSoundOff.visible = false;
        }
      }
    }
  }
}
