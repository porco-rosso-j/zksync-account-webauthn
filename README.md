## Overview

This is the submission for the Scaling Ethereum hackathon held by ETHGlobal.  
see: https://ethglobal.com/showcase/bye-bye-private-key-wm3aa

## Contracts

| contract           | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| Account.sol        | zkSync Account Abstraction Wallet                                                      |
| AccountFactory.sol | Deployer of Account.sol                                                                |
| WebAuthn.sol       | handles values given by webauthn and produces `message` for validation in EllipticCurve |
| EllipticCurve.sol  | verifies message and signature with publickey. ECDSA256 & p256 curve                     |
| Paymaster.sol      | sponsor for accounts' meta-transaction                                                 |

## Development

### Setup

```shell
git clone git@github.com:porco-rosso-j/zksync-account-webauthn.git
cd zksync-account-webauthn
yarn
```

### Run zksync local network

Docker should be run first.

```shell
git clone https://github.com/matter-labs/local-setup.git
cd local-setup
./start.sh
```

### Deployment

Create .env file and add the line `NODE_ENV="test"`.

Then run:

```shell
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy/deploy.ts
```

### Preparetion for frontend

Copy and paste deployed addresses to frontend/src/scripts/utils/address/ts

```shell
webauthn: "0x4B5DF730c2e6b28E17013A1485E5d9",
factory: "0x996462e0eAf00bF6BF0Ea15F29d715C0eD3906F1",
paymaster: "0x1A2894885076934dAf5a398Ff216c6d665707bbA",
```

### Run frontend

```shell
cd frontend
yarn
yarn start
```

### Caveats

zkSync has recently launched zkSync Era and many changes have been made in the dependencies. check: https://era.zksync.io/docs/dev/troubleshooting/changelog.html
