import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const logSchema = new mongoose.Schema({
    userId: String,
    top: Number,
    left: Number,
    target: Number,
    day: String,
    time: String
})

logSchema.plugin(mongoosePaginate)

export default mongoose.model('log', logSchema, 'log')
