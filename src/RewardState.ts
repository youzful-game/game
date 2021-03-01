import * as Phaser from "phaser";
import { GameAnalytics } from 'gameanalytics';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "RewardState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class RewardState extends Phaser.Scene {
  private sfxMusic!: Phaser.Sound.BaseSound;

  private musicOn: boolean = true;

  private startup: string = "";

  private backToVideoSelectState: boolean = false;

  private lfbWon: boolean = false;

  private yaplaWon: boolean = false;

  private klsWon: boolean = false;

  private blankWon: boolean = false;

  public constructor() {
    super(sceneConfig);
  }

  public init({ musicOn, startup, backToVideoSelectState, lfbWon, yaplaWon, klsWon, blankWon }: { musicOn: boolean, startup: string, backToVideoSelectState: boolean, lfbWon: boolean, yaplaWon: boolean, klsWon: boolean, blankWon: boolean }): void {
    this.musicOn = musicOn;
    this.startup = startup;
    this.backToVideoSelectState = backToVideoSelectState;
    this.lfbWon = lfbWon;
    this.yaplaWon = yaplaWon;
    this.klsWon = klsWon;
    this.blankWon = blankWon;
  }

  public create(): void {

    GameAnalytics.addBusinessEvent("EUR", 1, "Reward", "Video", this.startup);
    // Play video
    const vid = this.add.video(550/2, 400/2, this.startup);
    vid.setDisplaySize(550, vid.height * (550/vid.width));
    vid.play(false);
    vid.on('complete', () => this.startLevelsState(), this);
    vid.setPaused(false);

    if (this.backToVideoSelectState) {
      // Back to video select
      const buttonPlay = this.add.sprite(550 / 2, 375, "img_button_back");
      buttonPlay.setInteractive({ useHandCursor: true });
      buttonPlay.on("pointerdown", () => this.startVideoSelectState(), this);
    } else {
      // Back to levels
      const buttonPlay = this.add.sprite(550 / 2, 375, "img_button_back");
      buttonPlay.setInteractive({ useHandCursor: true });
      buttonPlay.on("pointerdown", () => this.startLevelsState(), this);
    }

    this.initAudio();
  }

  private startVideoSelectState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("VideoSelectState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  private startLevelsState(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.scene.start("LevelsState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }


  private initAudio(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      if (this.musicOn) {
        this.sfxMusic.mute = false;
      } else {
        this.sfxMusic.mute = true;
      }
      this.sfxMusic.setLoop(true);
    }
  }
}
