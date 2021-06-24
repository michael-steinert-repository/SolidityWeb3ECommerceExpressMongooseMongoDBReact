import MockDai from './contracts/MockDai.json';
import PaymentProcessor from './contracts/PaymentProcessor.json';
import Web3 from 'web3';

const getBlockchainData = () => {
    new Promise((resolve, reject) => {
        /* The Event load is triggered when everything is loaded on the Website like HTML, CSS and JavaScript - MetaMask */
        window.addEventListener('load', async () => {
            /*
            Two Step Process:
                1) MetaMask connects the Browser to the Blockchain
                2) Web3 connects the Application to the Blockchain
            */
            /* Connecting the Browser with MetaMask Extension to the Blockchain based Website */
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                await window.ethereum.enable();


                const web3 = window.web3;
                const accounts = await web3.eth.getAccounts();
                let mockDai = undefined;
                let paymentProcessor = undefined;

                /* Getting the connected Network from the Wallet */
                const networkId = await web3.eth.net.getId();

                /* Loading Smart Contract Mock DAI */
                /* Getting the Network Data from the ABI */
                const mockDaiNetworkData = MockDai.networks[networkId];
                /* Checking if Network exists */
                if (mockDaiNetworkData) {
                    /* JavaScript Versions of the Smart Contracts */
                    /* Web3 needs the ABI and Address of this Smart Contract to build a JavaScript Version of it */
                    mockDai = new web3.eth.Contract(MockDai.abi, MockDai.networks[networkId].address);
                }

                /* Loading Smart Contract Payment Processor */
                /* Getting the Network Data from the ABI */
                const paymentProcessorNetworkData = PaymentProcessor.networks[networkId];
                /* Checking if Network exists */
                if (paymentProcessorNetworkData) {
                    /* JavaScript Versions of the Smart Contracts */
                    /* Web3 needs the ABI and Address of this Smart Contract to build a JavaScript Version of it */
                    paymentProcessor = new web3.eth.Contract(PaymentProcessor.abi, PaymentProcessor.networks[networkId].address);
                }

                /* Creating Resolve Object for Promise */
                resolve({
                    web3: web3,
                    mockDai: mockDai,
                    paymentProcessor: paymentProcessor
                });
            } else {
                window.alert('Non-Ethereum Browser detected. You should using the MetaMask Extension');
                /* Creating Resolve Object for Promise */
                resolve({
                    web3: undefined,
                    mockDai: undefined,
                    paymentProcessor: undefined
                });
            }
        });
    });
}

export default getBlockchainData;