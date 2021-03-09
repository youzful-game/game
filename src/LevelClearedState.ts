import * as Phaser from "phaser";
import { EGAProgressionStatus, GameAnalytics } from 'gameanalytics';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "LevelClearedState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class LevelClearedState extends Phaser.Scene {
  private sfxMusic!: Phaser.Sound.BaseSound;

  private musicOn: boolean;

  private buttonSoundOn: Phaser.GameObjects.Sprite;

  private buttonSoundOff: Phaser.GameObjects.Sprite;

  private startup: string = "";

  private lfbWon: boolean = false;

  private yaplaWon: boolean = false;

  private klsWon: boolean = false;

  private blankWon: boolean = false;

  public constructor() {
    super(sceneConfig);
  }

  public init({ musicOn, startup, lfbWon, yaplaWon, klsWon, blankWon }: { musicOn: boolean, startup: string, lfbWon: boolean, yaplaWon: boolean, klsWon: boolean, blankWon: boolean }): void {
    this.musicOn = musicOn;
    this.startup = startup;
    this.lfbWon = lfbWon;
    this.yaplaWon = yaplaWon;
    this.klsWon = klsWon;
    this.blankWon = blankWon;
  }

  public create(): void {
    // Background
    this.add.image(550 / 2, 400 / 2, "img_background");

    // Level Cleared !
    this.add.sprite(550 / 2, 400/2, "img_level_cleared");
    GameAnalytics.addProgressionEvent(EGAProgressionStatus.Complete, this.startup);

    this.time.addEvent({
      callback: () => {
        if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
          this.scene.start("RewardState", { musicOn: this.musicOn, startup: this.startup, backToVideoSelectState: false, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
        }
      },
      delay: 1000,
      loop: false
    });

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


  private initAudio(): void {
    // Audio
    this.sfxMusic = this.sound.add("music_menu");
    this.sfxMusic.play();
    this.sfxMusic.stop();
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      if (this.musicOn) {
        this.sfxMusic.mute = true;
      } else {
        this.sfxMusic.mute = false;
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
