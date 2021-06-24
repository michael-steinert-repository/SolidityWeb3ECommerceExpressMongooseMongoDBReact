/* Solidity Version have to be compatible with the OpenZepplin Version */
pragma solidity ^0.8.0;

/* Importing an Interface of ERC20 Token from OpenZepplin that is needed to manipulate ERC20 Tokens */
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentProcessor {
    address public admin;
    /* Pointer to DAI Token*/
    IERC20 public mockDai;

    /* Constructor is run when Smart Contract is deployed - just one Time */
    constructor(address _admin, address _mockDai) public {
        admin = _admin;
        /* Passing the Address to the imported Smart Contract to interact with DAI Coin */
        mockDai = IERC20(_mockDai);
    }

    event PaymentDone(
        address payer,
        uint amount,
        uint paymentId,
        uint date
    );

    /* Function to do Payment if an Item is purchased  */
    /* Keyword external to call this Method from Outside the Smart Contract */
    function pay(uint _amount, uint _paymentId) external {
        /* Requirements */
        /* Make sure Payer Address exists */
        require(msg.sender != address(0x0));
        address payer = msg.sender;
        /* Make Amount is greater then 0 */
        require(_amount > 0, "Amount cannot be 0");
        /* ERC20 Method that allow to transfer a Amount of Token from an Account to another */
        mockDai.transferFrom(payer, admin, _amount);
        /* Emit Event */
        emit PaymentDone(payer, _amount, _paymentId, block.timestamp);
    }
}
