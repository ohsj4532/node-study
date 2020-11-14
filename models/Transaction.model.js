import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const transactionSchema = new mongoose.Schema({
    day: String,
    time: String,
    url: String,
    ip: String,
    host: String,
    responseTime: Number,
    status: String,
    message: String,
    contentLength: Number,
    gid: String
})

transactionSchema.plugin(mongoosePaginate)

export default mongoose.model('transaction', transactionSchema, 'transaction')
