// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./deps/Toucan.sol";

import "./TokenPool.sol";
import "./interfaces/ITokenPool.sol";

/**
 * @title Yieldgate Toucan Offsetter
 * @author Sebastian Stammler
 * @notice The Toucan Offsetter contract is designed to be the beneficiary of a
 * Yieldgate TokenPool, forwarding all generated yield to Toucan for carbon
 * offsetting.
 * @dev The beneficiary is set at deployment of a TokenPool. For that reason,
 * the ToucanOffsetter has to be deployed first, then the TokenPool with the
 * just deployed ToucanOffsetter as beneficiary and then finally the TokenPool
 * has to be set using setYGPool.
 * The alternative constructors of ToucanOffsetterPoolDeployment or
 * ToucanOffsetterPoolDeploymentApproval can be used to automate this process
 * within a single deployment transaction.
 */
contract ToucanOffsetter is AccessControl {
    using SafeERC20 for IERC20;

    /**
     * @notice Offsetters are allowed to call offsetYield. Only this contract's
     *   admin can grant this role to new addresses.
     */
    bytes32 public constant OFFSET_ROLE = keccak256("OFFSET_ROLE");

    /// @notice TokenPool from which yield is claimed.
    ITokenPool public pool;

    /// @notice Toucan OffsetHelper contract that is used for offsetting claimed yield.
    IToucanOffsetHelper public offsetHelper;

    /**
     * @notice YGPoolSet is emitted when the yieldgate pool is (re)set.
     * @param pool Address of Yieldgate pool.
     */
    event YGPoolSet(address indexed pool);

    /**
     * @notice Offset is emitted when yield has been claimed from the
     * TokenPool and used for offsetting via Toucan offset tokens.
     * @dev The last parameter offset only contains the sum of all offset TCO2s.
     * If individual TCO2s and amounts are of interest to the application, read
     * the Redeemed event emitted by the Toucan OffsetHelper.
     * @param token Address of input token that got swapped into Toucan offset token.
     * @param yield Amount of yield that got swapped.
     * @param offsetToken Toucan offset token that got redeemed.
     * @param offset Total sum of TCO2s that got offset.
     */
    event Offset(address indexed token, uint256 yield, address indexed offsetToken, uint256 offset);

    modifier onlyAdmin() {
        _checkRole(DEFAULT_ADMIN_ROLE);
        _;
    }

    /**
     * @notice Deploys the ToucanOffsetter with given Toucan OffsetHelper.
     * @dev TokenPool has to be deployed afterwards, setting this
     * ToucanOffsetter as beneficiary. Then setYGPool has to be called with the
     * TokenPool's address. ToucanOffsetterPoolDeployment can be used instead to
     * bundle this behavior.
     * The deployer is set as admin and also granted the offsetter role.
     * @param _toucanOffsettHelper Address of Toucan OffsetHelper.
     */
    constructor(address _toucanOffsettHelper) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OFFSET_ROLE, msg.sender);

        offsetHelper = IToucanOffsetHelper(_toucanOffsettHelper);
    }

    /**
     * @notice Sets the Yieldgate TokenPool.
     * @dev Can only be set by the admin.
     * @param _pool TokenPool address.
     */
    function setYGPool(address _pool) external onlyAdmin {
        _setYGPool(_pool);
    }

    function _setYGPool(address _pool) internal {
        pool = ITokenPool(_pool);
        emit YGPoolSet(_pool);
    }

    /**
     * @notice offsetYield claims all accrued yield from the TokenPool and then
     * uses the OffsetHelper to swap and retire the yield into Toucan offset
     * token.
     * @dev Emits an Offset event. Caller must have OFFSET_ROLE.
     * @param token Token to claim yield for from the TokenPool.
     * @param offsetToken Toucan offset token to use for offsetting (BCT, NCT, ...).
     */
    function offsetYield(address token, address offsetToken)
        external
        virtual
        onlyRole(OFFSET_ROLE)
    {
        uint256 yield = pool.claim(token);
        IERC20(token).safeApprove(address(offsetHelper), yield);
        (, uint256[] memory amounts) = offsetHelper.autoOffsetExactInToken(
            token,
            yield,
            offsetToken
        );

        uint256 offset;
        for (uint256 i = 0; i < amounts.length; i++) offset += amounts[i];
        emit Offset(token, yield, offsetToken, offset);
    }
}

/**
 * @dev The ToucanOffsetterPoolDeployment is the same contract as the
 * ToucanOffsetter while its constructor also deploys its own TokenPool, setting
 * it as its pool during deployment.
 */
contract ToucanOffsetterWithPoolDeployment is ToucanOffsetter {
    constructor(address _toucanOffsettHelper, address _aavePoolAddressesProvider)
        ToucanOffsetter(_toucanOffsettHelper)
    {
        // deploy own pool
        pool = new TokenPool(_aavePoolAddressesProvider, address(this));
        _setYGPool(address(pool));
    }
}

/**
 * @dev The ToucanOffsetterPoolDeploymentApproval is the same contract as the
 * ToucanOffsetter while its constructor also deploys its own TokenPool, setting
 * it as its pool during deployment and approves the Aave pool to transfer the
 * provided list of tokens on behalf of the TokenPool.
 */
contract ToucanOffsetterWithPoolDeploymentApproval is ToucanOffsetter {
    constructor(
        address _toucanOffsettHelper,
        address _aavePoolAddressesProvider,
        address[] memory _approvedTokens
    ) ToucanOffsetter(_toucanOffsettHelper) {
        // deploy own pool
        pool = new TokenPoolWithApproval(
            _aavePoolAddressesProvider,
            address(this),
            _approvedTokens
        );
        _setYGPool(address(pool));
    }
}
