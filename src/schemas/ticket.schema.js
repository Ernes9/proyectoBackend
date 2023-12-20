import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        require: true
    },
    purchase_datetime: {
        type: mongoose.SchemaTypes.Date,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    purchaser: {
        type: String,
        ref: 'carts',
        require: true
    }
})

const TicketModel = mongoose.model("ticket", ticketSchema)
export default TicketModel;