const express = require('express')
require('dotenv').config();
const router = express.Router()
const auth = require('../middleware/auth')
const Room = require('../model/room')
const User = require('../model/account');
const cors = require('cors');



//MongoDB Atlas connection setting
const mongoose = require('mongoose')
const connStr = process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PWD)
mongoose.connect(connStr, { useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                            useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => console.log('Connection ERROR!!!'))
db.once('open', () => console.log('Database CONNECTED!!!'))

// User endpoint

router.post('/hotelbook/users', async (req, res,) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({message : 'User added !', user, token});
    }
    catch(error){
        res.status(500).json({error :  error.message});
    }
});

router.get('/hotelbook/users/findid/:id', async(req,res,next) => {
    try {
        const t = await User.findById(req.params.id)
        if (!t) {
             res.status(404).json({error:'users not found'})
        }
        res.status(202).json(t)
    } catch (error) {
        res.status(500).json({error: 'GET::error'})
    }
})

router.put('/hotelbook/users/edit/:id', async(req,res) => {
    const update_t= {
        
        name : req.body.name,
        surname : req.body.surname,
        number : req.body.number,
        id : req.body.id,
        amountin : req.body.amountin,
        checkin : req.body.checkin,
        checkout : req.body.checkout,
        room:req.body.room,
    }
    try {
        const t = await User.findByIdAndUpdate(req.params.id, update_t, {new: true})
        if (!t){
            res.status(404).json({error: ' UPDATE::room not found!!!'})
        }else{
        res.status(200).json(t)
    }
    } catch (error) {
        res.status(500).json({error:'UPDATE::'+error.message})
    }
})


router.post('/hotelbook/users/login', async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if(!user)res.status(401).json({error : 'Login failed !'});
        const token = await user.generateAuthToken();
        res.status(201).json({token});
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
});

router.get('/hotelbook/users/me',auth,(req,res,next) => {
    const user = req.user
    try{
        res.status(200).send({user})
    }catch(error){
        res.status(201).send({error:error.message})
    }
})

router.get('/hotelbook/users/logout', auth, async (req, res, next) => {
    const user = req.user;
    const currToken = req.token;
    try{
        user.tokens = user.tokens.filter(item => {
            return item.token != currToken;
        });
        await user.save();
        res.status(201).json({message : 'logout success !'});
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
});

router.get('/hotelbook/users/getall', async (req,res,next) => {
    try{
        const user = await User.find()
        res.status(200).json(user)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

router.post('/hotelbook/users/logoutall', auth, async (req, res, next) => {
    const user = req.user;
    try{
        user.tokens.splice(0, user.tokens.length);
        await user.save();
        res.status(200).json({message : 'logout success !'});
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
});

router.put('/hotelbook/users/edit/:id',auth,async(req,res)=>{
    const user = req.user
    const update_t = {
        number : req.body.number,
        id : req.body.id,
        amountin : req.body.amountin,
        checkin : req.body.checkin,
        checkout : req.body.checkout
    }
    try{
        const t = await User.findByIdAndUpdate(req.params.id,update_t,{new:true})
        if(!t)
            res.status(201).send({error:'Update::transaction not found'})
        user.save()
        res.status(200).send(t)
    }catch(err){
        res.status(201).send({eror:err.message})
    }
})

// rooms endpoint

router.get('/hotelbook/room', async (req,res,next) => {
    try{
        const rooms = await Room.find()
        res.status(200).json(rooms)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

router.put('/hotelbook/room/:id', async(req,res) => {
    const update_t= {
        status : true
    }
    try {
        const t = await Room.findByIdAndUpdate(req.params.id, update_t, {new: true})
        if (!t){
            res.status(404).json({error: ' UPDATE::room not found!!!'})
        }else{
        res.status(200).json(t)
    }
    } catch (error) {
        res.status(500).json({error:'UPDATE::'+error.message})
    }
})


router.get('/hotelbook/room/:id', async(req,res,next) => {
    try {
        const t = await Room.findById(req.params.id)
        if (!t) {
             res.status(404).json({error:'room not found'})
        }
        res.status(202).json(t)
    } catch (error) {
        res.status(500).json({error: 'GET::error'})
    }
})
// findbytype not finish
// router.get('/hotelbook/room/:type', async(req,res,next) => {
//     try {
//         const t = await Room.findByType(req.params.type)
//         if (!t) {
//              res.status(404).json({error:'room not found'})
//         }
//         res.status(202).json(t)
//     } catch (error) {
//         res.status(500).json({error: 'GET::error'})
//     }
// })

router.post('/hotelbook/room', async (req,res) => {
    const t = new Room(req.body)
    try {
        await t.save()
        res.status(200).json(t)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

module.exports = router