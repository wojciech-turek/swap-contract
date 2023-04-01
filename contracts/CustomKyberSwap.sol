// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./IRouter.sol";

interface IWMATIC is IERC20 {
    function deposit() external payable;
}

contract CustomKyberSwap {
    IRouter public immutable swapRouter;

    address public constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address public constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address public constant stMATIC =
        0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4;

    uint24 public constant poolFee = 300;

    event LogDeposit(uint256 amount);
    event LogApproval(address token, address spender, uint256 amount);
    event LogSwapExecution(
        uint256 amountIn,
        uint256 amountOut,
        address tokenIn,
        address tokenOut
    );

    constructor(IRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    /// @notice Wraps the native token to WMATIC and swaps it for stMATIC and DAI half and half
    /// @return amountOut0 The amount of stMatic received for swapping WMATIC
    /// @return amountOut1 The amount of DAI received for swapping WMATIC

    function swapExactInputSingle()
        external
        payable
        returns (uint256 amountOut0, uint256 amountOut1)
    {
        // wrap the native token to WMATIC
        IWMATIC(WMATIC).deposit{value: msg.value}();
        emit LogDeposit(msg.value);
        uint256 halfAmount = msg.value / 2;

        // Approve the router to spend WMATIC.
        TransferHelper.safeApprove(WMATIC, address(swapRouter), msg.value);
        emit LogApproval(WMATIC, address(swapRouter), msg.value);
        // swap for stMATIC
        IRouter.ExactInputSingleParams memory params0 = IRouter
            .ExactInputSingleParams({
                tokenIn: WMATIC,
                tokenOut: stMATIC,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp + 300,
                amountIn: halfAmount,
                minAmountOut: 0,
                limitSqrtP: 0
            });
        // The call to `exactInputSingle` executes the swap.
        amountOut0 = swapRouter.swapExactInputSingle(params0);
        emit LogSwapExecution(halfAmount, amountOut0, WMATIC, stMATIC);
        // swap for DAI
        IRouter.ExactInputSingleParams memory params1 = IRouter
            .ExactInputSingleParams({
                tokenIn: WMATIC,
                tokenOut: DAI,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp + 300,
                amountIn: halfAmount,
                minAmountOut: 0,
                limitSqrtP: 0
            });
        // The call to `exactInputSingle` executes the swap.
        amountOut1 = swapRouter.swapExactInputSingle(params1);
        emit LogSwapExecution(halfAmount, amountOut1, WMATIC, stMATIC);
    }
}
