### setup

`yarn`

### run zksync local chain

```shell
git clone https://github.com/matter-labs/local-setup.git
cd local-setup
./start.sh
```

### deploy

create .env file and add the line `NODE_ENV="local"`.

then run:

```shell
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy/deploy.ts
```

### copy&paste deployed address to frontend/src/scripts/utils/address/ts

```shell
multicall1: "0xA1B809005E589f81dE6EF9F48D67e35606c05fC3",
multicall2: "0xc0431C32561DabE0c8FD791B52590BbBA413c235",
factory: "0x996462e0eAf00bF6BF0Ea15F29d715C0eD3906F1",
paymaster: "0x1A2894885076934dAf5a398Ff216c6d665707bbA",
```

### run frontend

```shell
cd frontend
yarn
yarn start
```
