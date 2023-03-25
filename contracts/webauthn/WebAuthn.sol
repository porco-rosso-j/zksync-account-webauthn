// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0;

import {EllipticCurve} from "./EllipticCurve.sol";

/**
The original Webauthn can be found here: 
https://github.com/alembic-tech/P256-verify-signature/blob/main/contracts/Webauthn.sol

The original version requires a contract to be deployed for each public key.  This has been changed so that an array of the public key coordinates is used instead. This simplifies the design and reduces gas consumption.
 */

error InvalidAuthenticatorData();
error InvalidClientData();
error InvalidSignature();

contract WebAuthn is EllipticCurve {
    function checkSignature(
        bytes memory authenticatorData,
        bytes1 authenticatorDataFlagMask,
        bytes memory clientData,
        string memory clientChallenge,
        uint clientChallengeDataOffset,
        uint[2] memory rs,
        uint[2] memory coordinates
    ) public pure returns (bool) {
        // Let the caller check if User Presence (0x01) or User Verification (0x04) are set
        if (
            (authenticatorData[32] & authenticatorDataFlagMask) !=
            authenticatorDataFlagMask
        ) {
            revert InvalidAuthenticatorData();
        }

        bytes memory challengeExtracted = new bytes(
            bytes(clientChallenge).length
        );

        copyBytes(
            clientData,
            clientChallengeDataOffset,
            challengeExtracted.length,
            challengeExtracted,
            0
        );

        if (
            keccak256(abi.encodePacked(bytes(clientChallenge))) !=
            keccak256(abi.encodePacked(challengeExtracted))
        ) {
            revert InvalidClientData();
        }

        // Verify the signature over sha256(authenticatorData || sha256(clientData))
        bytes memory verifyData = new bytes(authenticatorData.length + 32);

        copyBytes(
            authenticatorData,
            0,
            authenticatorData.length,
            verifyData,
            0
        );

        copyBytes(
            abi.encodePacked(sha256(clientData)),
            0,
            32,
            verifyData,
            authenticatorData.length
        );

        bytes32 message = sha256(verifyData);
        //return EllipticCurve.validateSignature(message, rs, coordinates);
        return validateSignature(message, rs, coordinates);
    }

    function validate(
        bytes memory authenticatorData,
        bytes1 authenticatorDataFlagMask,
        bytes memory clientData,
        string memory clientChallenge,
        uint clientChallengeDataOffset,
        uint[2] memory rs,
        uint[2] memory coordinates
    ) internal pure returns (bool) {
        if (
            !checkSignature(
                authenticatorData,
                authenticatorDataFlagMask,
                clientData,
                clientChallenge,
                clientChallengeDataOffset,
                rs,
                coordinates
            )
        ) {
            revert InvalidSignature();
        }
        return true;
    }

    /*
    The following function has been written by Alex Beregszaszi (@axic), use it under the terms of the MIT license
  */
    function copyBytes(
        bytes memory _from,
        uint _fromOffset,
        uint _length,
        bytes memory _to,
        uint _toOffset
    ) internal pure returns (bytes memory _copiedBytes) {
        uint minLength = _length + _toOffset;
        require(_to.length >= minLength); // Buffer too small. Should be a better way?
        uint i = 32 + _fromOffset; // NOTE: the offset 32 is added to skip the `size` field of both bytes variables
        uint j = 32 + _toOffset;
        while (i < (32 + _fromOffset + _length)) {
            assembly {
                let tmp := mload(add(_from, i))
                mstore(add(_to, j), tmp)
            }
            i += 32;
            j += 32;
        }
        return _to;
    }
}
