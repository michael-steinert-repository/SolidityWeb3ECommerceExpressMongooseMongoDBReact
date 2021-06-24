const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://michael:michael000@ethereum-ecommerce-clus.erwyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    isPaid: Boolean
});

const Payment = mongoose.model("Payment", paymentSchema);

/* Exporting the Payment Object to use it in other Files */
module.exports = {
    Payment: Payment
};