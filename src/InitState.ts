import * as Phaser from "phaser";
import { GameAnalytics } from 'gameanalytics';

import { baseURL } from "./constants/loading";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "InitState",
};

export default class InitState extends Phaser.Scene {
  public constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.initAnalytics();
    this.createLoadingScreen();
    this.loadSprites();
    this.loadSpriteSheets();
    this.loadAudio();
    this.loadVideos();
  }

  public initAnalytics(): void {
    GameAnalytics.configureBuild("1.0");
    GameAnalytics.initialize("d85122edcecca9de04591ba89c7a7fa8", "9da1740eebeecf6a8865be43d155c9424562052a");
  }

  public createLoadingScreen(): void {
    // Loading Screen
    this.load.baseURL = baseURL;

    // Background
    this.add.image(550 / 2, 400 / 2, "img_load");

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xaaaaaa, 0.8);
    progressBox.fillRect(215, 320, 110, 10);

    const progressBar = this.add.graphics();

    const { height, width } = this.cameras.main;

    const assetText = this.make.text({
      style: {
        fill: "#92cd00",
        fontFamily: 'gotham',
        fontSize: "20px"
      },
      text: "Loading...",
      x: width / 2,
      y: height / 2 + 150,
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(217, 322, 106 * value, 6);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  public loadSprites(): void {
    // Lava
    this.load.image("img_lava", "assets/img/lava.png");
    this.load.spritesheet("img_lava_particle", "assets/img/lava_bubble.png", {
      frameHeight: 8,
      frameWidth: 8,
    });

    this.load.image("img_button_play", "assets/img/button_play.png");
    this.load.image("img_button_help", "assets/img/button_help.png");
    this.load.image("img_button_back", "assets/img/button_back.png");
    this.load.image("img_button_play", "assets/img/button_play.png");
    this.load.image("img_button_play_LFB", "assets/img/lfb.png");
    this.load.image("img_button_play_YAPLA", "assets/img/yapla.png");
    this.load.image("img_button_play_KLS", "assets/img/kls.png");
    this.load.image("img_button_play_BLANK", "assets/img/blank.png");
    this.load.image("img_button_play_JSE", "assets/img/jse.png");
    this.load.image("img_button_videos", "assets/img/img_button_videos.png");
    this.load.image("img_button_try_again", "assets/img/try_again.png");
    this.load.image("sound_on", "assets/img/sound_on.png");
    this.load.image("sound_off", "assets/img/sound_off.png");
    this.load.image("check", "assets/img/check.png");
    this.load.image("help_text_1", "assets/img/help_text_1.png");
    this.load.image("help_text_2", "assets/img/help_text_2.png");

    this.load.image("img_background", "assets/img/back.png");
    this.load.image("img_help", "assets/img/help.png");

    // Title
    this.load.image("img_title", "assets/img/title.png");
    this.load.image("img_levels_title", "assets/img/levels_title.png");
    this.load.image("img_level_cleared", "assets/img/level_cleared.png");
    this.load.image("img_videos_title", "assets/img/img_videos_title.png");

    // Bricks
    this.load.image("img_brick_blue", "assets/img/bricks/blue.png");
    this.load.image("img_brick_brown", "assets/img/bricks/brown.png");
    this.load.image("img_brick_red", "assets/img/bricks/red.png");
    this.load.image("img_brick_yellow", "assets/img/bricks/yellow.png");
    this.load.image("img_brick_white", "assets/img/bricks/white.png");

    // Info bar
    this.load.image("img_info_bar", "assets/img/info_bar.png");
    this.load.image("img_game_over", "assets/img/game_over.png");

    // Ball
    this.load.image("img_ball_fire", "assets/img/ball_fire.png");
    this.load.image("img_ball", "assets/img/ball.png");

    // Bar
    this.load.image("img_bar", "assets/img/bar/bar.png");
    this.load.image("img_bar_small", "assets/img/bar/bar_small.png");
    this.load.image("img_bar_big", "assets/img/bar/bar_big.png");

    // Powerups
    this.load.image(
      "img_powerup_ball_fast",
      "assets/img/powerup/ball_fast.png"
    );
    this.load.image(
      "img_powerup_ball_fire",
      "assets/img/powerup/ball_fire.png"
    );
    this.load.image(
      "img_powerup_ball_slow",
      "assets/img/powerup/ball_slow.png"
    );
    this.load.image(
      "img_powerup_ball_multi",
      "assets/img/powerup/ball_multi.png"
    );
    this.load.image("img_powerup_bar_big", "assets/img/powerup/bar_big.png");
    this.load.image(
      "img_powerup_bar_small",
      "assets/img/powerup/bar_small.png"
    );
    this.load.image("img_powerup_error", "assets/img/powerup/error.png");
  }

  public loadSpriteSheets(): void {
    // Brick particles
    this.load.spritesheet(
      "img_particles_blue",
      "assets/img/bricks/particles_blue.png",
      { frameHeight: 20, frameWidth: 20 }
    );
    this.load.spritesheet(
      "img_particles_brown",
      "assets/img/bricks/particles_brown.png",
      { frameHeight: 20, frameWidth: 20 }
    );
    this.load.spritesheet(
      "img_particles_red",
      "assets/img/bricks/particles_red.png",
      { frameHeight: 20, frameWidth: 20 }
    );
    this.load.spritesheet(
      "img_particles_yellow",
      "assets/img/bricks/particles_yellow.png",
      { frameHeight: 20, frameWidth: 20 }
    );
    this.load.spritesheet(
      "img_particles_white",
      "assets/img/bricks/particles_white.png",
      { frameHeight: 20, frameWidth: 20 }
    );
  }

  public loadAudio(): void {
    // Music
    this.load.audio("music_menu", "assets/sfx/menu.mp3");
    this.load.audio("music_levels", "assets/sfx/menu.mp3");
    this.load.audio("music_LFB", "assets/sfx/lfb.mp3");
    this.load.audio("music_YAPLA", "assets/sfx/yapla.mp3");
    this.load.audio("music_KLS", "assets/sfx/kls.mp3");
    this.load.audio("music_BLANK", "assets/sfx/blank.mp3");
    this.load.audio("music_JSE", "assets/sfx/lfb.mp3");
    this.load.audio("music_game_over", "assets/sfx/menu.mp3");

    // Audio
    this.load.audio("bigger", "assets/sfx/bigger.mp3");
    this.load.audio("bounce", "assets/sfx/bounce.mp3");
    this.load.audio("break", "assets/sfx/break.mp3");
    this.load.audio("dirt", "assets/sfx/dirt.mp3");
    this.load.audio("explode", "assets/sfx/explode.mp3");
    this.load.audio("lava", "assets/sfx/lava.mp3");
    this.load.audio("multiball", "assets/sfx/multiball.mp3");
    this.load.audio("smaller", "assets/sfx/smaller.mp3");
    this.load.audio("slow_down", "assets/sfx/slow_down.mp3");
    this.load.audio("speed_up", "assets/sfx/speed_up.mp3");
  }

  public loadVideos(): void {
    this.load.video('lfb', 'assets/videos/LFB.mp4');
    this.load.video('yapla', 'assets/videos/YAPLA.mp4');
    this.load.video('kls', 'assets/videos/KLS.mp4');
    this.load.video('blank', 'assets/videos/BLANK.mp4');
    this.load.video('jse', 'assets/videos/JSE.mp4');
  }

  // Create
  public create(): void {
    this.scene.start("MenuState", { musicOn: true });
  }
}
