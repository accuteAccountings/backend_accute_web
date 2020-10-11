
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


const dig = '0123456789'
function getrandomnum (length) {
    let buff = []
     while(buff.length<length){
         const count = parseInt(Math.random()*(10))
         buff.push(dig.charAt(count))
     }
   return   buff.join('')

}


module.exports = { token_gen , getrandomnum }