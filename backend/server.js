const express = require("express");
const cors = require("cors");
const Web3 = require("web3");
const PaymentProcessor = require("../frontend/src/contracts/PaymentProcessor.json");
/* Importing the Payment Model from Database */
const {Payment} = require("./db.js");
const port = 4000;

const items = {
    "1": {id: 1, url: "http://UrlToDownloadItem1"},
    "2": {id: 2, url: "http://UrlToDownloadItem2"},
    "3": {id: 3, url: "http://UrlToDownloadItem3"},
    "4": {id: 4, url: "http://UrlToDownloadItem4"}
};

const app = express();

app.use(
    cors({
        /* Enable Requests from all Origins */
        origin: "*",
        /* Enable Append-only Methods cause of Blockchain Behaviour */
        methods: ["GET", "POST"],
        /* Enable all Credentials like Cookies */
        credentials: true
    })
);

app.get('/api/v1/getPaymentId/:itemId', async (request, response) => {
    const paymentId = (Math.random() * 10000).toFixed(0);
    /* Using Payment Model from Database */
    await Payment.create({
        id: paymentId,
        itemId: request.params.itemId,
        isPaid: false
    });
    /* Returning the PaymentId */
    response.json({
        paymentId: paymentId
    });
});

app.get('/api/v1/getItemUrl/:paymentId', async (request, response) => {
    const paymentId = (Math.random() * 10000).toFixed(0);
    /* Using Payment Model from Database */
    const payment = await Payment.findOne({
        id: request.params.paymentId,
    });

    if (payment && payment.isPaid) {
        /* Returning the PaymentId */
        response.json({
            url: items[payment.itemId].url
        });
    } else {
        response.json({
            url: ""
        });
    }
});

app.listen(port, () => {
    console.log(`Web Server listening on Port: ${port}`)
});

/* Getting the connected Network from the Wallet */
//const networkId = await web3.eth.net.getId();
const networkId = "5777";

const listenToEvents = () => {
    /* Listening for to Test Network - Ganache */
    //const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    /* Loading Smart Contract PaymentProcessor */
    /* Getting the Network Data from the ABI */
    const paymentProcessorNetworkData = PaymentProcessor.networks[networkId];
    /* Checking if Network exists */
    if (paymentProcessorNetworkData) {
        /* Listening for to Test Network - Ganache */
        const provider = "http://127.0.0.1:7545";
        const web3Provider = new Web3.providers.HttpProvider(provider);
        const web3 = new Web3(web3Provider);

        /* JavaScript Versions of the Smart Contracts */
        /* Web3 needs the ABI and Address of this Smart Contract to build a JavaScript Version of it */
        const paymentProcessor = new web3.eth.Contract(PaymentProcessor.abi, PaymentProcessor.networks[networkId].address);

        let subscription = web3.eth.subscribe("logs", (error, result) => {
            if (!error)
                console.log(result);
        });

        /* Listening for Event PaymentDone if new "data" appear into the Blockchain */

        paymentProcessor.events.PaymentDone({}).on("data", async (payer, amount, paymentId, date) => {
            console.log(`
                From: ${payer} 
                Amount: ${amount} 
                PaymentId: ${paymentId} 
                Date: ${(new Date(date.toNumber() * 1000)).toLocaleString()}
            `);

            const payment = await Payment.findOne({
               id: paymentId
            });

            if(payment){
                payment.isPaid = true;
                /* Using Payment Model of Mongoose from Database */
                await payment.save();
            }

        });
        /* The Method call() is necessary if Data is read from the Blockchain - to write Data into the Blockchain the Method send() is necessary */
    } else {
        window.alert('Smart Contract Payment Processor is not deployed to the detected Network');
    }
}

listenToEvents();