# platformer-js (Comments from chatGPT to remind myself the logic)


# 🚨 Issue #1: previousY starts at 0
-Your platforms are being placed above 0 (negative Y values), which isn't what you want. Platforms should start from the ground up, so previousY should start from the bottom of the canvas.

-🔹 Fix: let previousY = canvas.height - height;
