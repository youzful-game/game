/* eslint-disable max-lines */
import * as Phaser from "phaser";

import { EGAProgressionStatus, GameAnalytics } from 'gameanalytics';

import type { BrickType } from "./Brick";
import Brick from "./Brick";
import Lava from "./Lava";
import Bar from "./Bar";
import Ball from "./Ball";
import type { PowerupType } from "./Powerup";
import Powerup from "./Powerup";

const randomPowerupType = (): PowerupType => {
  const powerupTypes = ["slow", "fast", "multi", "big", "small"] as const;
  const powerupType = Phaser.Math.Between(0, powerupTypes.length - 1);
  return powerupTypes[powerupType];
};

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "YAPLAGameState",
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
    default: "arcade",
  },
};

export default class YAPLAGameState extends Phaser.Scene {
  private lives: number = 3;

  private readonly level: number = 1;

  private readonly levelWidth: number = 8;

  private readonly levelHeight: number = 6;

  private levelText!: Phaser.GameObjects.Text;

  private livesText!: Phaser.GameObjects.Text;

  private lava!: Lava;

  private bricks!: Phaser.Physics.Arcade.StaticGroup;

  private balls!: Phaser.Physics.Arcade.Group;

  private powerups!: Phaser.Physics.Arcade.Group;

  private bar!: Bar;

  private sfxSpeedUp!: Phaser.Sound.BaseSound;

  private sfxSlowDown!: Phaser.Sound.BaseSound;

  private sfxSmaller!: Phaser.Sound.BaseSound;

  private sfxMultiball!: Phaser.Sound.BaseSound;

  private sfxBigger!: Phaser.Sound.BaseSound;

  private sfxBounce!: Phaser.Sound.BaseSound;

  private sfxBreak!: Phaser.Sound.BaseSound;

  private sfxDirt!: Phaser.Sound.BaseSound;

  private sfxExplode!: Phaser.Sound.BaseSound;

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
    this.initUi();
    this.initGameObjects();
    this.initAudio();
    this.changeLevel();
  }

  public initUi(): void {
    // Background
    this.add.image(550 / 2, 400 / 2, "img_background");

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

    // Text
    this.levelText = this.add.text(150, 17, `LEVEL : YOUZFUL SITE`, {
      fill: "#92cd00",
      fontFamily: 'gotham',
      fontSize: "24px"
    });
    this.livesText = this.add.text(4, 17, `LIVES : ${this.lives}`, {
      fill: "#92cd00",
      fontFamily: 'gotham',
      fontSize: "24px"
    });
  }

  public initGameObjects(): void {
    // Lava
    this.lava = new Lava(this, 550 / 2, 400 - 10);
    this.add.existing(this.lava);

    // Bricks group
    this.bricks = new Phaser.Physics.Arcade.StaticGroup(
      this.physics.world,
      this
    );

    // Balls group
    this.balls = new Phaser.Physics.Arcade.Group(this.physics.world, this);

    // Powerups group
    this.powerups = new Phaser.Physics.Arcade.Group(this.physics.world, this);

    // Create bar
    this.bar = new Bar(this, 550 / 2, 340, 1);
  }

  public initAudio(): void {
    // Audio
    this.sfxSpeedUp = this.sound.add("speed_up");
    this.sfxSlowDown = this.sound.add("slow_down");
    this.sfxSmaller = this.sound.add("smaller");
    this.sfxMultiball = this.sound.add("multiball");

    this.sfxBigger = this.sound.add("bigger");
    this.sfxBounce = this.sound.add("bounce");
    this.sfxBreak = this.sound.add("break");
    this.sfxDirt = this.sound.add("dirt");
    this.sfxExplode = this.sound.add("explode");

    this.sfxMusic = this.sound.add("music_YAPLA");
    this.sfxMusic.play();
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      if (this.musicOn) {
        this.sfxMusic.mute = false;
      } else {
        this.sfxMusic.mute = true;
      }
      this.sfxMusic.setLoop(true);
    }

    const sfxLava = this.sound.add("lava");
    if (this.musicOn) {
      sfxLava.play();
    }
  }

  public toggleAudio(): void {
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

  public endLevel(): void {
    if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
      this.sfxMusic.stop();
      this.yaplaWon = true;
      this.scene.start("LevelClearedState", { musicOn: this.musicOn, startup: "yapla", lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
    }
  }

  public changeLevel(): void {
    // Intensify!
    if (this.level <= 10) {
      this.lava.lavaEmitter.setSpeed({
        max: 100 + this.level * 10,
        min: 50 + this.level * 10,
      });
      this.lava.lavaEmitter.setLifespan({
        max: 500 + this.level * 50,
        min: 100 + this.level * 30,
      });
    }

    // Bar
    this.bar.setBarSize(0);

    // Balls
    this.balls.clear(true, true);

    // Create ball
    this.createBall(550 / 2, 300, true);

    // Bricks
    this.bricks.clear(true, true);

    // Make bricks
    this.makeBricks(this.levelWidth, this.levelHeight);

    // Powerups
    this.powerups.clear(true, true);

    // Create colliders
    this.createColliders();
  }

  public createColliders(): void {
    this.createCollider(
      this.bricks,
      this.balls,
      this.collideBrickBall.bind(this)
    );
    this.createCollider(this.balls, this.bar, this.collideBallBar.bind(this));
    this.createCollider(
      this.powerups,
      this.bar,
      this.collidePowerupBar.bind(this)
    );
    this.createCollider(this.balls, this.lava, this.collideBallLava.bind(this));
    this.createCollider(
      this.powerups,
      this.lava,
      this.collidePowerupLava.bind(this)
    );
  }

  public createCollider(
    group1: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group,
    group2: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group,
    collider: (
      obj1: Phaser.GameObjects.GameObject,
      obj2: Phaser.GameObjects.GameObject
    ) => void
  ): void {
    // eslint-disable-next-line no-undefined
    this.physics.add.collider(group1, group2, collider, undefined, this);
  }

  public makeBricks(newWidth: number, newHeight: number): void {
    // Create asked amount
    let specialBricks = 0;
    for (let i = 0; i < newWidth; i += 1) {
      for (let t = 0; t < newHeight; t += 1) {
        if (t === 1) {
          if (i === 2 || i === 5) {
            // eslint-disable-next-line no-continue
            continue;
          }
        }
        if (t === 3) {
          if (i === 1 || i === 6) {
            // eslint-disable-next-line no-continue
            continue;
          }
        }
        if (t === 4) {
          if (i === 2 || i === 3 || i === 4 || i === 5) {
            // eslint-disable-next-line no-continue
            continue;
          }
        }


        const brickTypes: BrickType[] = ["blue", "brown", "red", "yellow"];
        const brickType = Phaser.Math.Between(0, 3);
        const isSpecial = Phaser.Math.Between(0, 10) === 1;

        let newBrick: Brick | null = null;

        if (isSpecial) {
          newBrick = new Brick(this, 0, 0, "white");
          specialBricks += 1;
        } else if (brickType < 4) {
          newBrick = new Brick(this, 0, 0, brickTypes[brickType]);
        }

        if (newBrick) {
          newBrick.x = 45 + i * 64;
          newBrick.y = 70 + t * 24;
          this.bricks.add(newBrick);
        }
      }
    }
    if (specialBricks > 0) {
      return;
    }
    this.bricks.clear(true, true);
    this.makeBricks(newWidth, newHeight);
  }

  public update(): void {
    // Update bar, keyboard polling
    this.bar.update();

    // Lose game! (YOUUU LOSSEEEE *dannyvoice*(tm))
    if (this.lives <= 0) {
      this.sfxMusic.stop();
      this.lives = 3;
      if (this.sfxMusic instanceof Phaser.Sound.WebAudioSound) {
        GameAnalytics.addProgressionEvent(EGAProgressionStatus.Fail, "yapla");
        this.scene.start("GameOverState", { musicOn: this.musicOn, lfbWon: this.lfbWon, yaplaWon: this.yaplaWon, klsWon: this.klsWon, blankWon: this.blankWon });
      }
    }

    // Level Cleared !
    if (this.bricks.getLength() <= 0) {
      this.endLevel();
    }

    // Waiting ball? Move ball with bar
    this.balls.getChildren().forEach((child) => {
      if (child instanceof Ball && child.isWaiting()) {
        child.x = this.bar.x;
      }
    });

    // Display lives
    this.livesText.setText(`LIVES : ${this.lives}`);

    // Display current level
    this.levelText.setText(`LEVEL : YOUZFUL SITE`);
  }

  public makeExplosion(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    gravity: number,
    particleImage: string
  ): void {
    // Explosion emitter
    const brickEmitter = this.add.particles(particleImage).createEmitter({});
    brickEmitter.setFrame([0, 1, 2, 3], true);
    brickEmitter.setSpeed(speed);
    brickEmitter.setGravity(0, gravity);
    brickEmitter.setScale(0.7);
    brickEmitter.setLifespan({ max: 600, min: 200 });

    const emitZoneRect = {
      quantity: 1,
      source: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      type: "random",
    };

    brickEmitter.setEmitZone(emitZoneRect);
    brickEmitter.explode(10, x, y);
  }

  private createPowerup(
    x: number,
    y: number,
    type: PowerupType,
    velocityX: number,
    velocityY: number
  ): void {
    const newPowerup = new Powerup(this, x, y, type);
    this.powerups.add(newPowerup);
    if (newPowerup.body instanceof Phaser.Physics.Arcade.Body) {
      newPowerup.body.setVelocity(velocityX, velocityY);
    }
  }

  private createBall(x: number, y: number, waiting: boolean): Ball {
    const newBall = new Ball(this, x, y, waiting);
    this.balls.add(newBall);
    if (newBall.body instanceof Phaser.Physics.Arcade.Body) {
      newBall.body.setCollideWorldBounds(true);
      newBall.body.setVelocity(0);
      newBall.body.bounce.setTo(1, 1);
    }
    return newBall;
  }

  private collideBrickBall(brick: Phaser.GameObjects.GameObject): void {
    if (!(brick instanceof Brick)) {
      return;
    }

    const { x, y, width, height } = brick;

    const particles = {
      blue: "img_particles_blue",
      brown: "img_particles_brown",
      red: "img_particles_red",
      white: "img_particles_white",
      yellow: "img_particles_yellow",
    };

    switch (brick.getBrickType()) {
      case "blue":
        this.makeExplosion(x, y, width, height, 100, 80, particles.blue);
        break;
      case "brown":
        if (this.musicOn) {
          this.sfxDirt.play();
        }
        this.makeExplosion(x, y, width, height, 40, 50, particles.brown);
        break;
      case "red":
        this.makeExplosion(x, y, width, height, 80, 80, particles.red);
        this.bricks.add(new Brick(this, x, y, "blue"));
        break;
      case "yellow":
        if (this.musicOn) {
          this.sfxExplode.play();
        }
        this.makeExplosion(x, y, width, height, 200, 50, particles.yellow);
        break;
      case "white":
        this.makeExplosion(x, y, width, height, 50, 70, particles.white);
        this.createPowerup(x, y, randomPowerupType(), 0, 60);
        break;
      default:
        console.warn("Invalid brick id ", brick.getBrickType());
        break;
    }
    if (this.musicOn) {
      this.sfxBounce.play();
      this.sfxBreak.play();
    }
    // Remove brick
    this.bricks.remove(brick, true, true);
  }

  private collideBallBar(
    bar: Phaser.GameObjects.GameObject,
    ball: Phaser.GameObjects.GameObject
  ): void {
    if (!(bar instanceof Bar) || !(ball instanceof Ball)) {
      return;
    }
    if (this.musicOn) {
      this.sfxBounce.play();
    }
    ball.hitBar(bar.x);
  }

  // eslint-disable-next-line max-lines-per-function
  private collidePowerupBar(
    bar: Phaser.GameObjects.GameObject,
    powerup: Phaser.GameObjects.GameObject
  ): void {
    if (!(bar instanceof Bar) || !(powerup instanceof Powerup)) {
      return;
    }

    switch (powerup.getType()) {
      case "slow":
        this.balls.getChildren().forEach((child) => {
          if (
            child instanceof Ball &&
            child.body instanceof Phaser.Physics.Arcade.Body
          ) {
            child.body.setVelocity(
              child.body.velocity.x * 0.8,
              child.body.velocity.y * 0.8
            );
          }
        });
        if (this.musicOn) {
          this.sfxSlowDown.play();
        }
        break;
      case "fast":
        this.balls.getChildren().forEach((child) => {
          if (
            child instanceof Ball &&
            child.body instanceof Phaser.Physics.Arcade.Body
          ) {
            child.body.setVelocity(
              child.body.velocity.x * 1.2,
              child.body.velocity.y * 1.2
            );
          }
        });
        if (this.musicOn) {
          this.sfxSpeedUp.play();
        }
        break;
      case "multi":
        this.balls.getChildren().forEach((child) => {
          if (
            child instanceof Ball &&
            child.body instanceof Phaser.Physics.Arcade.Body &&
            !(child.waiting)
          ) {
            const newBall = this.createBall(child.x, child.y, false);

            if (newBall.body instanceof Phaser.Physics.Arcade.Body) {
              newBall.body.setVelocity(
                -child.body.velocity.x,
                child.body.velocity.y
              );
            }
          }
        });
        if (this.musicOn) {
          this.sfxMultiball.play();
        }
        break;
      case "big":
        bar.setBarSize(1);
        if (this.musicOn) {
          this.sfxBigger.play();
        }
        break;
      case "small":
        bar.setBarSize(-1);
        if (this.musicOn) {
          this.sfxSmaller.play();
        }
        break;
      default:
        console.warn("Invalid powerup id ", powerup.getType());
        break;
    }

    // Remove powerup
    this.powerups.remove(powerup, true, true);
  }

  private collideBallLava(
    _lava: Phaser.GameObjects.GameObject,
    ball: Phaser.GameObjects.GameObject
  ): void {
    if (!(ball instanceof Ball)) {
      return;
    }

    // Remove ball
    this.balls.remove(ball, true, true);

    // Make a new one
    if (this.balls.getLength() === 0) {
      this.createBall(550 / 2, 300, true);

      // Lives down
      this.removeLife();
    }
  }

  private collidePowerupLava(
    _lava: Phaser.GameObjects.GameObject,
    powerup: Phaser.GameObjects.GameObject
  ): void {
    if (!(powerup instanceof Powerup)) {
      return;
    }

    // Remove powerup
    this.powerups.remove(powerup, true, true);
  }

  private removeLife(): void {
    this.lives -= 1;
  }
}
