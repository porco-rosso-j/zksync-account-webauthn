//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

contract Position {
    bytes32 public positionHash;
    bool public isPositionEnabled;

    function enablePosition(bytes32 _position) public {
        require(msg.sender == address(this), "INVALID_CALLER");
        isPositionEnabled = true;
        positionHash = _position;
    }

    function disablePosition() public {
        require(msg.sender == address(this), "INVALID_CALLER");
        isPositionEnabled = false;
        positionHash = bytes32(0);
    }

    function checkPosition(
        bytes calldata _data //,
    )
        public
        view
        returns (
            // bool _hasMaxPrefix
            // bytes memory
            bytes memory
        )
    {
        (bytes32 position, bytes memory data) = abi.decode(
            _data,
            (bytes32, bytes)
        );

        if (positionHash != position) revert("INVALID_POSITION");

        return data;
    }
}
