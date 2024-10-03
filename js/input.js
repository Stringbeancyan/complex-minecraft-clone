export function handleInput(player) {
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'w': player.moveForward = true; break;
            case 's': player.moveBackward = true; break;
            case 'a': player.moveLeft = true; break;
            case 'd': player.moveRight = true; break;
        }
    });

    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'w': player.moveForward = false; break;
            case 's': player.moveBackward = false; break;
            case 'a': player.moveLeft = false; break;
            case 'd': player.moveRight = false; break;
        }
    });
}
