//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
 
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

contract TransferableAAFactory {
    bytes32 public transferableAABytecodeHash;
 
    constructor(bytes32 _transferableAABytecodeHash) {
        transferableAABytecodeHash = _transferableAABytecodeHash;
    }
 
    function deployAccount(
        bytes32 _salt,
        uint[2] memory _coordinates
    ) external returns (address accountAddress) {
        (bool success, bytes memory returnData) = SystemContractsCaller
            .systemCallWithReturndata(
                uint32(gasleft()),
                address(DEPLOYER_SYSTEM_CONTRACT),
                uint128(0),
                abi.encodeCall(
                    DEPLOYER_SYSTEM_CONTRACT.createAccount,
                    (
                        _salt,
                        transferableAABytecodeHash,
                        abi.encode(_coordinates),
                        IContractDeployer.AccountAbstractionVersion.Version1
                    )
                )
            );
        require(success, "Deployment Failed");
        accountAddress = abi.decode(returnData, (address));
    }
}