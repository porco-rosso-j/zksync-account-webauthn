import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DAppProvider, Config, MetamaskConnector } from "@usedapp/core";
import { ColorModeScript } from "@chakra-ui/react";
import theme from './theme'
import { ZkSyncLocal } from "./scripts/utils/zkSyncLocal";

const config: Config = {
  networks: [ZkSyncLocal],
  readOnlyUrls: {
    [ZkSyncLocal.chainId]: 'http://localhost:3050'
  },
  connectors: {
    metamask: new MetamaskConnector(),
  },
  gasLimitBufferPercentage: 20 // The percentage by which the transaction may exceed the estimated gas limit
}

ReactDOM.render(
    <React.StrictMode>
      <DAppProvider config={config}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </DAppProvider>
    </React.StrictMode>,
  document.getElementById("root")
);
