const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
        
    },
    prize: {
        type: Number,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    surname: {
        type: String,
        required: false,
    },
    id: {
        type: String,
        required: false,
    },
    status:{
        type: Boolean,
        default: false,
    }
})
// findbytype not finish
// roomSchema.statics.findByType = async (type) => {
//     try{
//         const t = await User.findOne({type});
//         if(!t)throw new Error({message : "Room not found !"});
//         return t;
//     }
//     catch(error){
//         return null;
//     }
// }



//.model(export-name, schema, collection-name)
const Room = mongoose.model('Room', roomSchema)
module.exports = Room;