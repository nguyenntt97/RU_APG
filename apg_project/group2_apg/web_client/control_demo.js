
const { spawn } = require('child_process');
const readline = require('readline');
const { keyboard, Key, sleep } = require('@nut-tree/nut-js');

// var keypress = require('keypress');

var my_game = spawn('../MyPacman.exe');
// my_game.stdin.on("data", d => {
//     console.log(`Data in: ${d}`);
// })

// process.stdin.pipe(my_game.stdin);
// process.stdin.resume();

// process.stdin.setEncoding('utf8');

// process.stdin.on('data', (key) => {
//     console.log(`Pressed ${key}`);
//     my_game.stdin.write(key);

//     if (key === '\u0003') {
//         process.exit();
//     }
// })

my_game.on('close', code => {
    console.log(`Child process exited with code ${code}`);
});
process.stdin.on('data', (key) => {
    console.log(`Pressed ${key}`);
    my_game.stdin.write(key);

    if (key === '\u0003') {
        process.exit();
    }
})

readline.emitKeypressEvents(my_game.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

(async () => {
    await sleep(3000);
    keyboard.type(Key.Up);
    console.log(`Done!`)

    await sleep(3000);
    keyboard.type(Key.Right);
    console.log(`Done!`)
})();