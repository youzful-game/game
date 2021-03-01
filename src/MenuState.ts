import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "MenuState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class MenuState extends Phaser.Scene {
  private sfxMusic!: Phaser.Sound.BaseSound;

  private musicOn: boolean;

  private buttonSoundOn: Phaser.GameObjects.Sprite;

  private buttonSoundOff: Phaser.GameObjects.Sprite;

  public constructor() {
    super(sceneConfig);
  }

  public init({ musicOn }: { musicOn: boolean}): void {
    this.musicOn = musicOn;
  }

  public create(): void {
    // Background
    this.add.image(550 / 2, 400 / 2, "img_background");

    // Title
    this.add.image(550 / 2, 100, "img_title");

    // Play button
    const buttonPlay = this.add.sprite(550 / 2, 230, "img_button_play");
    buttonPlay.setInteractive({ useHandCursor: true });
    buttonPlay.on("pointerdown", () => this.startHelpState(), this);

    // Sound button
    this.buttonSoundOn = this.add.sprite(480, 30, "sound_on");
    this.buttonSoundOn.setInteractive({ useHandCursor: true });
    this.buttonSoundOn.on("pointerdown", () => this.toggleAudio(), this);
    this.buttonSoundOn.visible = true;

    this.buttonSoundOff = this.add.sprite(480, 30, "sound_off");
    this.buttonSoundOff.setInteractive({ useHandCursor: true });
    this.buttonSoundOff.on("pointerdown", () => this.toggleAudio(), this);
    this.buttonSoundOff.visible = false;

    this.initAudio();
  }

  private startHelpState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("HelpState", { musicOn: this.musicOn });
    }
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
