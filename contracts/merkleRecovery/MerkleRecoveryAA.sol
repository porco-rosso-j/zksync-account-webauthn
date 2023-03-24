//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
 
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractHelper.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/openzeppelin/utils/Address.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./MerkleTransactionHelper.sol";
import "./IAccount.sol";
import "../webauthn/WebAuthn.sol";
 
contract MerkleRecoveryAA is IAccount, IERC1271, WebAuthn {
    using MerkleTransactionHelper for Transaction;
 
    bytes32 public merkleRoot;
    uint[2] public coordinates;
    string public lastChallenge;
    bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;
 
    /**
     * @dev Simulate the behavior of the EOA if the caller is not the bootloader.
     * Essentially, for all non-bootloader callers halt the execution with empty return data.
     * If all functions will use this modifier AND the contract will implement an empty payable fallback()
     * then the contract will be indistinguishable from the EOA when called.
     */
    modifier ignoreNonBootloader() {
        if (msg.sender != BOOTLOADER_FORMAL_ADDRESS) {
            // If function was called outside of the bootloader, behave like an EOA.
            assembly {
                return(0, 0)
            }
        }
        // Continue execution if called from the bootloader.
        _;
    }
 
    /**
     * @dev Simulate the behavior of the EOA if it is called via `delegatecall`.
     * Thus, the default account on a delegate call behaves the same as EOA on Ethereum.
     * If all functions will use this modifier AND the contract will implement an empty payable fallback()
     * then the contract will be indistinguishable from the EOA when called.
     */
    modifier ignoreInDelegateCall() {
        address codeAddress = SystemContractHelper.getCodeAddress();
        if (codeAddress != address(this)) {
            // If the function was delegate called, behave like an EOA.
            assembly {
                return(0, 0)
            }
        }
 
        // Continue execution if not delegate called.
        _;
    }
 
    /// @param _coordinates:fsdf
    constructor(uint[2] memory _coordinates) {
        coordinates = _coordinates;
    }
 
    // ---------------------------------- //
    //             Validation             //
    // ---------------------------------- //
 
    /// @notice Validates the transaction & increments nonce.
    /// @dev The transaction is considered accepted by the account if
    /// the call to this function by the bootloader does not revert
    /// and the nonce has been set as used.
    /// @param _suggestedSignedHash The suggested hash of the transaction to be signed by the user.
    /// This is the hash that is signed by the EOA by default.
    /// @param _transaction The transaction structure itself.
    /// @dev Besides the params above, it also accepts unused first paramter "_txHash", which
    /// is the unique (canonical) hash of the transaction.
    function validateTransaction(
        bytes32,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    )
        external
        payable
        override
        ignoreNonBootloader
        ignoreInDelegateCall
        returns (bytes4 magic)
    {
        return _validateTransaction(_suggestedSignedHash, _transaction);
    }
 
    /// @notice Inner method for validating transaction and increasing the nonce
    /// @param _suggestedSignedHash The hash of the transaction signed by the EOA
    /// @param _transaction The transaction.
    /// @return magic The bytes4 value that is ACCOUNT_VALIDATION_SUCCESS_MAGIC if valid
    function _validateTransaction(
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) internal returns (bytes4 magic) {
        SystemContractsCaller.systemCallWithPropagatedRevert(
            uint32(gasleft()),
            address(NONCE_HOLDER_SYSTEM_CONTRACT),
            0,
            abi.encodeCall(
                INonceHolder(NONCE_HOLDER_SYSTEM_CONTRACT)
                    .incrementMinNonceIfEquals,
                (_transaction.nonce)
            )
        );
 
        bytes32 txHash = _suggestedSignedHash == bytes32(0)
            ? _transaction.encodeHash()
            : _suggestedSignedHash;
 
        uint256 totalRequiredBalance = _transaction.totalRequiredBalance();
        require(
            totalRequiredBalance <= address(this).balance,
            "Not enough balance for fee + value"
        );
 
        if (
            isValidSignature(txHash, _transaction.signature) ==
            EIP1271_SUCCESS_RETURN_VALUE
        ) {
            magic = ACCOUNT_VALIDATION_SUCCESS_MAGIC;
            lastChallenge = getChallenge(_transaction.signature);
        } else {
            magic = bytes4(0);
        }
    }
 
    /// @dev Should return whether the signature provided is valid for the provided data
    /// @param _hash The hash of the transaction to be signed.
    /// @param _signature The signature of the transaction.
    /// @return magic The bytes4 value that is ACCOUNT_VALIDATION_SUCCESS_MAGIC if valid
    function isValidSignature(
        bytes32 _hash,
        bytes memory _signature
    ) public view override returns (bytes4 magic) {
        magic = EIP1271_SUCCESS_RETURN_VALUE;
 
        (
            bytes memory authenticatorData,
            bytes1 authenticatorDataFlagMask,
            bytes memory clientData,
            string memory clientChallenge,
            uint clientChallengeDataOffset,
            uint[2] memory rs,
            uint[2] memory _coordinates
        ) = decodeSignature(_signature);
 
        require(
            keccak256(abi.encodePacked((clientChallenge))) !=
                keccak256(abi.encodePacked((lastChallenge))),
            "INVALID_CHALLENGE"
        );
 
        bool verificationResult = validate(
            authenticatorData,
            authenticatorDataFlagMask,
            clientData,
            clientChallenge,
            clientChallengeDataOffset,
            rs,
            _coordinates
        );
 
        if (!verificationResult) {
            magic = bytes4(0);
        }
    }
 
    function decodeSignature(
        bytes memory _signature
    )
        public
        pure
        returns (
            bytes memory,
            bytes1,
            bytes memory,
            string memory,
            uint,
            uint[2] memory,
            uint[2] memory
        )
    {
        (
            bytes memory authenticatorData,
            bytes1 authenticatorDataFlagMask,
            bytes memory clientData,
            string memory clientChallenge,
            uint clientChallengeDataOffset,
            uint[2] memory rs,
            uint[2] memory _coordinates
        ) = abi.decode(
                _signature,
                (bytes, bytes1, bytes, string, uint, uint[2], uint[2])
            );
 
        return (
            authenticatorData,
            authenticatorDataFlagMask,
            clientData,
            clientChallenge,
            clientChallengeDataOffset,
            rs,
            _coordinates
        );
    }
 
    function getChallenge(
        bytes memory _signature
    ) public pure returns (string memory) {
        (, , , string memory clientChallenge, , ,) = decodeSignature(_signature);
        return clientChallenge;
    }
 
    // ---------------------------------- //
    //             Executions             //
    // ---------------------------------- //
 
    /// @notice Method called by the bootloader to execute the transaction.
    /// @param _transaction The transaction to execute.
    /// @dev It also accepts unused _txHash and _suggestedSignedHash parameters:
    /// the unique (canonical) hash of the transaction and the suggested signed
    /// hash of the transaction.
    function executeTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override ignoreNonBootloader ignoreInDelegateCall {
        _executeTransaction(_transaction);
    }
 
    /// @notice Inner method for executing a transaction.
    /// @param _transaction The transaction to execute.
    /// @dev _transaction has three additional fields: merkleRoot, password and proof
    function _executeTransaction(Transaction calldata _transaction) internal {
        (, , , , , , uint[2] memory _coordinates) = decodeSignature(_transaction.signature);
        // Set merkleRoot if it has not been set and tx is sent from public key holder
        if (merkleRoot == 0 && coordinates[0] == _coordinates[0] && coordinates[1] == _coordinates[1] && _transaction.merkleRoot != 0) {
            merkleRoot = _transaction.merkleRoot;
        // Change public key holder if password and proof are valid for the merkleRoot
        } else if (merkleRoot != 0 && _verifyPassword(_transaction.password, _transaction.proof)) {
            merkleRoot = _transaction.merkleRoot;
            coordinates[0] = _coordinates[0];
            coordinates[1] = _coordinates[1];
        // Execute calldata
        } else {
            address to = address(uint160(_transaction.to));
            bytes memory data = _transaction.data;
            Address.functionCall(to, data);
        }
    }

    /// @notice Check if a password is a leaf that makes the merkle root
    /// @param _password Must be hashed
    /// @param _proof Generated offchain using the array of passwords
    function _verifyPassword(string memory _password, bytes32[] memory _proof)
        internal
        view
        returns (bool)
    {
        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));
        return MerkleProof.verify(_proof, merkleRoot, hashedPassword);
    }
        /// @notice Method that should be used to initiate a transaction from this account
    /// by an external call. This is not mandatory but should be implemented so that
    /// it is always possible to execute transactions from L1 for this account.
    /// @dev This method is basically validate + execute.
    /// @param _transaction The transaction to execute.
    function executeTransactionFromOutside(
        Transaction calldata _transaction
    ) external payable override ignoreNonBootloader ignoreInDelegateCall {
        _validateTransaction(bytes32(0), _transaction);
        _executeTransaction(_transaction);
    }
 
    // ---------------------------------- //
    //               Others               //
    // ---------------------------------- //
 
    /// @notice Method for paying the bootloader for the transaction.
    /// @param _transaction The transaction for which the fee is paid.
    /// @dev It also accepts unused _txHash and _suggestedSignedHash parameters:
    /// the unique (canonical) hash of the transaction and the suggested signed
    /// hash of the transaction.
    function payForTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override ignoreNonBootloader ignoreInDelegateCall {
        bool success = _transaction.payToTheBootloader();
        require(success, "Failed to pay the fee to the operator");
    }
 
    /// @notice Method, where the user should prepare for the transaction to be
    /// paid for by a paymaster.
    /// @dev Here, the account should set the allowance for the smart contracts
    /// @param _transaction The transaction.
    /// @dev It also accepts unused _txHash and _suggestedSignedHash parameters:
    /// the unique (canonical) hash of the transaction and the suggested signed
    /// hash of the transaction.
    function prepareForPaymaster(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override ignoreNonBootloader ignoreInDelegateCall {
        _transaction.processPaymasterInput();
    }
 
    fallback() external {
        // fallback of default account shouldn't be called by bootloader under no circumstances
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
 
        // If the contract is called directly, behave like an EOA
    }
 
    receive() external payable {
        // If the contract is called directly, behave like an EOA.
        // Note, that is okay if the bootloader sends funds with no calldata as it may be used for refunds/operator payments
    }
}