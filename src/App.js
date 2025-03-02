import "./styles.css";
import { useRef, useState, useEffect } from "react";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 25;
    canvas.width = 400;
    canvas.height = 400;
    let pos = {
      x: 0,
      y: canvas.height - size,
    };
    let gravity = 0.25;
    let velocity = {
      x: 0,
      y: 0,
    };
    let ID = null;
    let isJumping = false;

    function handleKeyPress({ key }) {
      switch (key) {
        case "ArrowLeft":
          velocity.x = -5;
          break;
        case "ArrowRight":
          velocity.x = 5;
          break;
        case "ArrowUp":
          if (!isJumping) {
            velocity.y = -10;
            isJumping = true;
          }
          break;
      }
    }

    function handleKeyUp({ key }) {
      if (key === "ArrowLeft" || key === "ArrowRight") {
        velocity.x = 0;
      }
    }

    function applyGravity() {
      velocity.y += gravity;
    }

    function checkCollision() {
      if (pos.y + size >= canvas.height) {
        pos.y = canvas.height - size;
        velocity.y = 0;
        isJumping = false;
      }

      if (pos.x + size >= canvas.width) {
        pos.x = canvas.width - size;
        velocity.x = 0;
      }

      if (pos.x <= 0) {
        pos.x = 0;
        velocity.x = 0;
      }
    }

    function updatePosition() {
      pos.x += velocity.x;
      pos.y += velocity.y;
    }

    function drawPlayer() {
      ctx.fillStyle = "blue";
      ctx.fillRect(pos.x, pos.y, size, size);
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      applyGravity();
      updatePosition();
      checkCollision();
      drawPlayer();
      ID = requestAnimationFrame(gameLoop);
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
