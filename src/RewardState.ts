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

  private musicOn: boolean = true;

  private startup: string = "";

  private backToVideoSelectState: boolean = false;

  private backToBonusSelectState: boolean = false;

  private lfbWon: boolean = false;

  private yaplaWon: boolean = false;

  private klsWon: boolean = false;

  private blankWon: boolean = false;

  public constructor() {
    super(sceneConfig);
  }

  public init({ musicOn, startup, backToVideoSelectState, backToBonusSelectState, lfbWon, yaplaWon, klsWon, blankWon }: { musicOn: boolean, startup: string, backToVideoSelectState: boolean, backToBonusSelectState: boolean, lfbWon: boolean, yaplaWon: boolean, klsWon: boolean, blankWon: boolean }): void {
    this.musicOn = musicOn;
    this.startup = startup;
    this.backToVideoSelectState = backToVideoSelectState;
    this.backToBonusSelectState = backToBonusSelectState;
    this.lfbWon = lfbWon;
    this.yaplaWon = yaplaWon;
    this.klsWon = klsWon;
    this.blankWon = blankWon;
  }

  // eslint-disable no-lonely-if
  public create(): void {

    GameAnalytics.addBusinessEvent("EUR", 1, "Reward", "Video", this.startup);
    // Play video
    const vid = this.add.video(550/2, 400/2, this.startup);
    vid.setDisplaySize(550, vid.height * (550/vid.width));
    vid.play(false);
    vid.on('complete', () => this.startLevelsState(), this);
    vid.setPaused(false);
    // Go to external site
    const buttonLink = this.add.sprite(550/2, 375, "img_button_external_link");
    buttonLink.setInteractive({ useHandCursor: true });
    buttonLink.on("pointerdown", () => this.openExternalLink(), this);

    if (this.backToVideoSelectState) {
      // Back to video select
      const buttonPlay = this.add.sprite(500, 375, "img_button_back");
      buttonPlay.setInteractive({ useHandCursor: true });
      buttonPlay.on("pointerdown", () => this.startVideoSelectState(), this);
    } else {
      if (this.backToBonusSelectState) {
        // Back to bonus select
        const buttonPlay = this.add.sprite(500, 375, "img_button_back");
        buttonPlay.setInteractive({ useHandCursor: true });
        buttonPlay.on("pointerdown", () => this.startBonusSelectState(), this);
      } else {
        // Back to levels
        const buttonPlay = this.add.sprite(500, 375, "img_button_back");
        buttonPlay.setInteractive({ useHandCursor: true });
        buttonPlay.on("pointerdown", () => this.startLevelsState(), this);
      }
    }
  }
  // eslint-enable

  private openExternalLink(): void {
    const url = 'https://www.youzful-by-ca.fr/creation-compte/pro';

    window.open(url, '_blank');
  }

  private startVideoSelectState(): void {
    this.scene.start("VideoSelectState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
  }

  private startBonusSelectState(): void {
    this.scene.start("BonusSelectState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
  }

  private startLevelsState(): void {
    this.scene.start("LevelsState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
  }

}
