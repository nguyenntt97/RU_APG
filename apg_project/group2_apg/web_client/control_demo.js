
// const { spawn } = require('child_process');
var ref = require('ref');
const ffi = require('ffi');
// var keypress = require('keypress');

var voidPtr = ref.refType(ref.types.void);
var stringPtr = ref.refType(ref.types.CString);

var WMsg = {
    WM_KEYUP: 0x0101,
    WM_KEYDOWN: 0x0100
}

var KB = {
    RIGHT: 0x0027
}

var user32 = ffi.Library('user32', {
    'FindWindowA': [
        'pointer', ['string', 'string']
    ],
    'SendMessageA': [
        'pointer', ['pointer', 'int32', 'int32', 'int32']
    ]
});


var process = user32.FindWindowA(null, "Stage 1")
console.log("Process ID", process)
setTimeout(() => {
    var rs = user32.SendMessageA(process, WMsg.WM_KEYDOWN, KB.RIGHT, 0)
    rs = user32.SendMessageA(process, WMsg.WM_KEYUP, KB.RIGHT, 0)
    console.log("Executed: ", rs)
}, 3000)

// var current = ffi.Library('/test', {
//     'atoi': ['int', ['string']]
// });
// console.log(current.atoi('1234')) // 2

