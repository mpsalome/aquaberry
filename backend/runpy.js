import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const {spawn} = require('child_process');

let python = spawn('python', ['./servo.py'])
python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...', data.toString());
   
});
python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
});
