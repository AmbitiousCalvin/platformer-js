import "./styles.css";
import { useRef, useState, useEffect } from "react";
import { levels } from "./level";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 25;
    canvas.width = 500;
    canvas.height = 500;
    let gravity = 0.5;
    let pos = { x: 0, y: canvas.height - size };
    let velocity = { x: 0, y: 0 };
    let isJumping = false;
    let ID = null;

    let platforms = [
      { x: 50, y: 425, width: 100, height: 25 }, // Platform 1
      { x: 150, y: 375, width: 100, height: 25 }, // Platform 2
      { x: 250, y: 300, width: 100, height: 25 }, // Platform 3
      { x: 350, y: 225, width: 100, height: 25 }, // Platform 4
      { x: 250, y: 150, width: 100, height: 25 }, // Platform 5
      { x: 200, y: 75, width: 100, height: 25 }, // Platform 6
      { x: 50, y: 0, width: 100, height: 25 }, // Platform 7
    ];

    function drawPlatforms() {
      for (let platform of platforms) {
        ctx.fillStyle = "blue";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      }
    }

    function handleKeyPress({ key }) {
      switch (key) {
        case "ArrowLeft":
          velocity.x = -5;
          break;
        case "ArrowRight":
          velocity.x = 5;
          break;
        case "ArrowUp":
          // once the player is in air, he can't jump again in the air
          if (!isJumping) {
            velocity.y = -11;
            isJumping = true;
          }
          break;

        default:
          break;
      }

      // checkPlatformCollision();
    }
    let hasWon = false;
    let currentLevel = 7;
    function changeLevels() {
      if (pos.y + velocity.y / 2 < 0) {
        currentLevel++;
        if (currentLevel > 7) {
          hasWon = true;
          pos.y = canvas.height - size;
          pos.x = 0;
        }
        velocity.x = 0;
        velocity.y = 0;
        pos.y = levels[currentLevel][0].y - size;
        pos.x = levels[currentLevel][0].x + levels[currentLevel][0].width / 2;
      }
    }

    function checkPlatformCollision() {
      for (let { x, y, width, height } of platforms) {
        if (
          pos.x + size > x &&
          pos.x < x + width &&
          pos.y + size + velocity.y >= y && // Ensures Player is moving downwards
          pos.y + size + velocity.y <= y + height // Ensures Player is above platform bottom
        ) {
          pos.y = y - size;
          isJumping = false;
          velocity.y = 0;
        }

        if (
          pos.x + size > x &&
          pos.x < x + width &&
          pos.y + velocity.y <= y + height && // Player's head is colliding
          pos.y + size > y + height // Ensures player is moving upwards into the platform
        ) {
          pos.y = y + height;
          velocity.y = 0;
        }
      }
    }

    function handleKeyUp({ key }) {
      // only stop moving horizontally once you let go off the left/right arrow keys
      if (key === "ArrowLeft" || key === "ArrowRight") {
        velocity.x = 0;
      }
    }

    function checkCollision() {
      if (pos.x + size >= canvas.width) {
        pos.x = canvas.width - size;
        velocity.x = 0;
      }

      if (pos.y + size >= canvas.height) {
        pos.y = canvas.height - size;
        velocity.y = 0;
        isJumping = false;
      }
      if (pos.x <= 0) {
        pos.x = 0;
        velocity.x = 0;
      }
      if (pos.y <= 0) {
        pos.y = 0;
        velocity.y = 0;
      }
    }

    function applyGravity() {
      velocity.y += gravity;
    }

    function updatePosition() {
      pos.x += velocity.x;
      pos.y += velocity.y;
    }

    function drawPlayer() {
      ctx.fillStyle = "orange";
      ctx.fillRect(pos.x, pos.y, size, size);
    }

    function gameLoop() {
      ID = requestAnimationFrame(gameLoop);
      platforms = levels[currentLevel];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      applyGravity();
      checkPlatformCollision();
      updatePosition();
      checkCollision();
      drawPlayer();
      drawPlatforms();
      changeLevels();
      if (hasWon) {
        ctx.fillStyle = "gold";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "You beat the game! Congrats!",
          canvas.width / 2,
          canvas.height / 2
        );
        cancelAnimationFrame(ID);
      }

      ctx.fillStyle = "gold";
      ctx.font = "bold 16px Arial"; // Smaller font size
      ctx.textAlign = "right"; // Align text to the right
      ctx.fillText(`Current Level: ${currentLevel}`, canvas.width - 10, 20); // 10px padding from the right
    }

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);
    gameLoop();

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(ID);
    };
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
