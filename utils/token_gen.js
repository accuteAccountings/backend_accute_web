
let a = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"

function token_gen(digit) {
    let ran = []
    for (let j = 0; j < digit; j++) {
        let x = (Math.random() * (62))
        x = Math.round(x)
        ran.push(a.charAt(x))
    }
    let str = ran.join('')
    return str
}

module.exports = { token_gen }