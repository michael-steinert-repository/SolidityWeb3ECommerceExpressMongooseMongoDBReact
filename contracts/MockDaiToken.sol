pragma solidity ^0.8.0;

/* Importing an Implementation of ERC20 Token from OpenZepplin */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/* The origin DAI Token is deployed on the Main Network */
/* For Test Purposes Mock DAI Token is created */
/* Mock DAI is inheriting from the imported ERC20 Token */
contract MockDaiToken is ERC20 {
    /* Calling the inherited Constructor */
    constructor() ERC20("Mock DAI Token", "DAI") public {}

    /* Function to faucet some Tokens in the Test Network */
    function faucet(address _to, uint _amount) external {
        _mint(_to, _amount);
    }
}
