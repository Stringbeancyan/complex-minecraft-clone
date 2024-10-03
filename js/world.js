export function generateWorld() {
    const world = [];

    for (let x = -10; x <= 10; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -10; z <= 10; z++) {
                world.push({
                    position: [x, y, z],
                    blockType: 'stone'
                });
            }
        }
    }

    return world;
}
