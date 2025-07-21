import mongoose from "mongoose";
const Schema = mongoose.Schema

const SessionSchema = new Schema({

    sessionName: {
        type: String,
        require: true
    },
    
    accessCode: {
        type: String,
        require: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }

})

const Session = mongoose.model("sessions", SessionSchema)

export default Session