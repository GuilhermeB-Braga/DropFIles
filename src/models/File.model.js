import mongoose from "mongoose";
const Schema = mongoose.Schema

const FileSchema = new Schema({

    originalname: {
        type: String,
        require: true
    },

    savedName: {
        type: String,
        require: true
    },

    fileSize: {
        type: Number,
        require: true
    },

    path: {
        type: String,
        require: true
    },

    sessionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'sessions'
    },

    sentAt: {
        type: Date,
        default: Date.now
    }

})

const File = mongoose.model("files", FileSchema)

export default File