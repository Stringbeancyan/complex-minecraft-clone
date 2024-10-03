import { initRenderer } from './renderer.js';
import { handleInput } from './input.js';
import { Player } from './player.js';
import { generateWorld } from './world.js';

let player, world, renderer;

function init() {
    const canvas = document.getElementById('gameCanvas');
    renderer = initRenderer(canvas);
    
    player = new Player();
    world = generateWorld();

    // Handle player input
    handleInput(player);

    // Start the game loop
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    // Update player movement
    player.update();

    // Render the world and player
    renderer.render(world, player);

    // Continue loop
    requestAnimationFrame(gameLoop);
}

init();
