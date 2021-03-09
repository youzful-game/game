import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "VideoSelectState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class VideoSelectState extends Phaser.Scene {
  private sfxMusic!: Phaser.Sound.BaseSound;

  private lfbWon: boolean = false;

  private yaplaWon: boolean = false;

  private klsWon: boolean = false;

  private blankWon: boolean = false;

  private musicOn: boolean = true;

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
    this.add.image(550 / 2, 100, "img_videos_title");

    // LFB level button
    const buttonPlayLFB = this.add.sprite(550 / 2, 170, "img_button_play_LFB");
    buttonPlayLFB.setInteractive({ useHandCursor: true });
    buttonPlayLFB.on("pointerdown", () => this.startLFBRewardState(), this);

    // Yapla level button
    const buttonPlayYAPLA = this.add.sprite(550 / 2, 215, "img_button_play_YAPLA");
    buttonPlayYAPLA.setInteractive({ useHandCursor: true });
    buttonPlayYAPLA.on("pointerdown", () => this.startYAPLARewardState(), this);

    // KLS level button
    const buttonPlayKLS = this.add.sprite(550 / 2, 260, "img_button_play_KLS");
    buttonPlayKLS.setInteractive({ useHandCursor: true });
    buttonPlayKLS.on("pointerdown", () => this.startKLSRewardState(), this);

    // BLANK level button
    const buttonPlayBLANK = this.add.sprite(550 / 2, 305, "img_button_play_BLANK");
    buttonPlayBLANK.setInteractive({ useHandCursor: true });
    buttonPlayBLANK.on("pointerdown", () => this.startBLANKRewardState(), this);

    // Back to levels
    const buttonPlay = this.add.sprite(550 / 2, 350, "img_button_back");
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

  private startLFBRewardState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("RewardState", { musicOn: this.musicOn, startup: "lfb", backToVideoSelectState: true, backToBonusSelectState: false, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startYAPLARewardState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("RewardState", { musicOn: this.musicOn, startup: "yapla", backToVideoSelectState: true, backToBonusSelectState: false, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startKLSRewardState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("RewardState", { musicOn: this.musicOn, startup: "kls", backToVideoSelectState: true, backToBonusSelectState: false, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startBLANKRewardState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("RewardState", { musicOn: this.musicOn, startup: "blank", backToVideoSelectState: true, backToBonusSelectState: false, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
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
