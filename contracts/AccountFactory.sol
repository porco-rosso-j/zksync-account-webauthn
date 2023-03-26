//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

contract AccountFactory {
    bytes32 public accountBytecodeHash;
    address public webauthn;

    constructor(bytes32 _accountBytecodeHash, address _webauthn) {
        accountBytecodeHash = _accountBytecodeHash;
        webauthn = _webauthn;
    }

    function deployAccount(
        bytes32 salt,
        uint[2] memory _q
    ) external returns (address accountAddress) {
        (bool success, bytes memory returnData) = SystemContractsCaller
            .systemCallWithReturndata(
                uint32(gasleft()),
                address(DEPLOYER_SYSTEM_CONTRACT),
                uint128(0),
                abi.encodeCall(
                    DEPLOYER_SYSTEM_CONTRACT.create2Account,
                    (
                        salt,
                        accountBytecodeHash,
                        abi.encode(_q, webauthn),
                        IContractDeployer.AccountAbstractionVersion.Version1
                    )
                )
            );
        require(success, "Deployment Failed");
        accountAddress = abi.decode(returnData, (address));
    }
}
