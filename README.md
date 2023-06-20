## Overview

This is the submission for Scaling Ethereum hackathon held by ETHGlobal.  
see: https://ethglobal.com/showcase/bye-bye-private-key-wm3aa

### caveat

This implementation currently doesn't work as zkSync Era limits the max transaction gas limit to 300,000. 
Plus, the network introduces many changes in dependencies that might cause lots of dep errors. check: https://era.zksync.io/docs/dev/troubleshooting/changelog.html

## Contracts

| contract           | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| Account.sol        | zkSync Account Abstraction Wallet                                                      |
| AccountFactory.sol | Deployer of Account.sol                                                                |
| WebAuthn.sol       | handles values given by webauthn and produce `message` for validation in EllipticCurve |
| EllipticCurve.sol  | verify message and signature with publickey. ECDSA256 & p256 curve                     |
| Paymaster.sol      | sponsor for accounts' meta-transaction                                                 |

## Development

### setup

```shell
git clone git@github.com:porco-rosso-j/zksync-account-webauthn.git
cd zksync-account-webauthn
yarn
```

### Run zksync local network

docker should be run first.

```shell
git clone https://github.com/matter-labs/local-setup.git
cd local-setup
./start.sh
```

### Deployment

create .env file and add the line `NODE_ENV="test"`.

then run:

```shell
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy/deploy.ts
```

### Preparetion for frontend

copy&paste deployed address to frontend/src/scripts/utils/address/ts

```shell
webauthn: "0x4B5DF730c2e6b28E17013A1485E5d9",
factory: "0x996462e0eAf00bF6BF0Ea15F29d715C0eD3906F1",
paymaster: "0x1A2894885076934dAf5a398Ff216c6d665707bbA",
```

### run frontend

```shell
cd frontend
yarn
yarn start
```


