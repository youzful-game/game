import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "HelpState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class HelpState extends Phaser.Scene {
  private musicOn: boolean = true;

  private buttonSoundOn: Phaser.GameObjects.Sprite;

  private buttonSoundOff: Phaser.GameObjects.Sprite;

  public constructor() {
    super(sceneConfig);
  }

  public init({ musicOn }: { musicOn: boolean }): void {
    this.musicOn = musicOn;
  }

  public create(): void {
    // Background
    this.add.image(550 / 2, 400 / 2, "img_background");

    // Help page
    this.add.image(550 / 2, 100, "img_help");

    this.time.addEvent({
      callback: () => {
        this.add.image(550/2, 200, "help_text_1");
      },
      delay: 300,
      loop: false
    });

    this.time.addEvent({
      callback: () => {
        this.add.image(550/2, 250, "help_text_2");
      },
      delay: 2000,
      loop: false
    });

    this.time.addEvent({
      callback: () => {
        this.startLevelsState();
      },
      delay: 4000,
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
  }

  private startLevelsState(): void {
    this.scene.start("LevelsState", { musicOn: this.musicOn, lfbWon: false, yaplaWon: false, klsWon: false, blankWon: false });
  }

  private toggleAudio(): void {
    if (this.musicOn) {
      this.musicOn = false;
      if (this.buttonSoundOn instanceof Phaser.GameObjects.Sprite) {
        this.buttonSoundOn.visible = false;
      }
      if (this.buttonSoundOff instanceof Phaser.GameObjects.Sprite) {
        this.buttonSoundOff.visible = true;
      }
    } else {
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
