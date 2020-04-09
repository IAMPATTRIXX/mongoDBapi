const express = require('express')
const router = express.Router()

const Acc = require('../model/account')

router.get('/account', async (req,res,next) => {
    try{
        const rooms = await Acc.find()
        res.status(200).json(rooms)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

router.put('/account/:id', async(req,res) => {
    const update_t= {
        // type : req.body.type,
        // room: req.body.room,
        // amount: Number(req.body.amount),
        // prize : Number(req.body.prize),
        name : req.body.name,
        surname : req.body.surname,
        id : req.body.id,
        status : true

    }
    try {
        const t = await Acc.findByIdAndUpdate(req.params.id, update_t, {new: true})
        if (!t){
            res.status(404).json({error: ' UPDATE::room not found!!!'})
        }else{
        res.status(200).json(t)
    }
    } catch (error) {
        res.status(500).json({error:'UPDATE::'+error.message})
    }
})

router.delete('/account/:id', async (req,res) => {
    try {
        const t = await Acc.findByIdAndDelete(req.params.id)
            res.status(200).json({message: 'room Deleted!!'})
    } catch (error) {
        res.status(500).json({error: 'DELETE::transaction not found'})
    }
})

router.get('/account/:id', async(req,res,next) => {
    try {
        const t = await Acc.findById(req.params.id)
        if (!t) {
             res.status(404).json({error:'room not found'})
        }
        res.status(202).json(t)
    } catch (error) {
        res.status(500).json({error: 'GET::error'})
    }
})

router.post('/account/', async (req,res) => {
    // const type = req.body.type
    // const room = req.body.room
    // const amount = req.body.amount
    // const prize = req.body.prize
    // const t = new Room(req.body)

    const type = req.body.type
    const room = req.body.room
    const amount = req.body.amount
    const prize = req.body.prize
    // const name = req.body.name
    // const surname = req.body.surname
    // const id = req.body.id
    const status = false
    const t = new Acc(req.body)

    try {
        await t.save()
        res.status(200).json(t)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

module.exports = router