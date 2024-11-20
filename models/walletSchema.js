import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        require:true
    },
    balance:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const walletModel = mongoose.model('wallet',walletSchema)

export default walletModel;