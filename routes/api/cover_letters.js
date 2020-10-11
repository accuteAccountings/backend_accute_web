const {Router} = require('express')
const route = Router()
const {auth} = require('../../middleware/auth')
const {CoverLetters, CoverNotes} = require('../../db/db')

route.post('/' , auth , async(req,res) => {
    const letter = await CoverLetters.create({
        UserId : req.user.id,
        cover_Letter : req.body.cover_Letter 
       })

    if(letter){
        res.send(true)
    }
})

route.post('/cover_note' , auth , async(req,res) => {
    const notes = await CoverNotes.create({
        cover_note : req.body.cover_note,
        CLetterId : req.body.letter_id
    })

    if(notes){
        res.send(true)
    }
})

route.get('/cover_letter' , auth , async(req,res) => {
    let letters = await CoverLetters.findAll({
        where : {userId : req.user.id}
    })

    letters = letters.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      })
    res.send(letters)
})

route.get('/cover_notes' , auth , async(req,res) => {
    let notes = await CoverNotes.findAll({
        where : {CletterId : req.query.id}
    })

    console.log(req.query.id + 'hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')

    res.send(notes)
})

module.exports  ={route}