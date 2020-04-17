const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name : {type : String, required : false, trim : true},
    surname : {type : String, required : false, trim : true},
    number : {type : String, required : false, minlength : 10},
    id : {type : String, required : false, minlength : 13},
    email : {type : String, required : false, unique : true, lowercase : true,
            validator : (value) => {
                if(!validator.isEmail()){
                    throw new Error('Invalid email !');
                }
            }},
    password : {type : String, required : false, minlength : 6},
    admin : {type : Boolean, default : false},
    tokens : [{
        token : {type : String, required : true}
    }],
    
    amountin : {type : Number, required : false},
    checkin : {type : String, required : false},
    checkout : {type : String, required : false},
    room:{type : String, required : false},
    
});

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const payload = {
        _id : user._id,
        email : user.email,
        admin : user.admin
    };

    const token = jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn : '2h', issuer : 'eiei'});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    try{
        const user = await User.findOne({email});
        if(!user)throw new Error({message : "User not found !"});
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch)throw new Error({message : 'Password not match !'});
        return user;
    }
    catch(error){
        return null;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;
