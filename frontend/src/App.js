import MockDaiToken from './contracts/MockDaiToken.json';
import PaymentProcessor from './contracts/PaymentProcessor.json';
import React, {Component} from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import axios from 'axios';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            mockDaiToken: {},
            paymentProcessor: {},
            items: [],
            url: 'http://localhost:4000',
            loading: true,
        };
        /* Bind Function buyItem() so Click Event do not lose its Context and can use the (this.)State */
        this.buyItem = this.buyItem.bind(this);
    }

    /* Lifecycle Function from ReactJs which will executed when the Component is mounted into the Application */

    /* It is called before the Function render() is executed */
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
        this.loadItemData();
    }

    /*
    Two Step Process:
        1) MetaMask connects the Browser to the Blockchain
        2) Web3 connects the Application to the Blockchain
    */

    /* Connecting the Browser with MetaMask Extension to the Blockchain based Website */
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Non-Ethereum Browser detected. You should using the MetaMask Extension');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({
            account: accounts[0]
        });

        /* Getting the connected Network from the Wallet */
        const networkId = await web3.eth.net.getId();

        /* Loading Smart Contract Mock DAI Token */
        /* Getting the Network Data from the ABI */
        const mockDaiTokenNetworkData = MockDaiToken.networks[networkId];
        /* Checking if Network exists */
        if (mockDaiTokenNetworkData) {
            /* Updating the State */
            this.setState({
                loading: true
            });
            /* JavaScript Versions of the Smart Contracts */
            /* Web3 needs the ABI and Address of this Smart Contract to build a JavaScript Version of it */
            const mockDaiToken = new web3.eth.Contract(MockDaiToken.abi, MockDaiToken.networks[networkId].address);
            /* Updating the State */
            this.setState({
                mockDaiToken: mockDaiToken,
                loading: false
            });
        } else {
            window.alert('Smart Contract Mock DAI Token is not deployed to the detected Network');
        }

        /* Loading Smart Contract Payment Processor */
        /* Getting the Network Data from the ABI */
        const paymentProcessorNetworkData = PaymentProcessor.networks[networkId];
        /* Checking if Network exists */
        if (paymentProcessorNetworkData) {
            /* Updating the State */
            this.setState({
                loading: true
            });
            /* JavaScript Versions of the Smart Contracts */
            /* Web3 needs the ABI and Address of this Smart Contract to build a JavaScript Version of it */
            const paymentProcessor = new web3.eth.Contract(PaymentProcessor.abi, PaymentProcessor.networks[networkId].address);
            /* Updating the State */
            this.setState({
                paymentProcessor: paymentProcessor,
                loading: false
            });
        } else {
            window.alert('Smart Contract Payment Processor is not deployed to the detected Network');
        }
    }

    loadItemData() {
        const items = [
            {
                id: 1,
                name: 'item1',
                /*web3.utils.toWei("42","Ether")*/
                price: 42
            },
            {
                id: 2,
                name: 'item2',
                price: 44
            },
        ];
        this.setState({
            items: items
        });
    }

    async buyItem(item) {
        const url = this.state.url;
        const itemPrice = item.price;
        let response = await axios.get(`${url}/api/v1/getPaymentId/${item.id}`);
        /* The Method call() is necessary if Data is read from the Blockchain - to write Data into the Blockchain the Method send() is necessary */
        /*
        Two Step Process:
            1) Approving the Tokens so they can be spent - first Transaction
            2) Staking the Tokens to the Smart Contract Token Farm - second Transaction
        */
        /* The Method send() is necessary if Data is write into the Blockchain */
        this.state.mockDaiToken.methods.approve(this.state.paymentProcessor._address, itemPrice).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.state.paymentProcessor.methods.pay(itemPrice, response.data.paymentId).send({from: this.state.account}).on('transactionHash', (hash) => {
                this.setState({
                    loading: false
                });
            });
        });
        /* Waiting 5 Sec until the Block int the Blockchain is mined */
        await new Promise(resolve => setTimeout(resolve, 5000));

        response = await axios.get(`${url}/api/v1/getItemURL/${response.data.paymentId}`);
        /* Logging the Download URL */
        console.log(response);
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account}/>
                {this.state.loading
                    ? <div id="loader" className="text-center mt-5"><p>Loading Website</p></div>
                    : <Main
                        buyItem={this.buyItem}
                        items={this.state.items}
                    />
                }
            </div>
        );
    }
}

export default App;