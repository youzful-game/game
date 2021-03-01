import * as Phaser from "phaser";
import Lava from "./Lava";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "GameOverState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class GameOverState extends Phaser.Scene {
  private sfxMusic!: Phaser.Sound.BaseSound;

  private musicOn: boolean = true;

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

    // Lava
    this.add.existing(new Lava(this, 550 / 2, 400 - 10));

    // Game Over !
    this.add.sprite(550 / 2, 120, "img_game_over");

    // Back to levels
    const buttonPlay = this.add.sprite(550 / 2, 300, "img_button_try_again");
    buttonPlay.setInteractive({ useHandCursor: true });
    buttonPlay.on("pointerdown", () => this.startLevelsState(), this);

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

  private startLevelsState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("LevelsState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
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
