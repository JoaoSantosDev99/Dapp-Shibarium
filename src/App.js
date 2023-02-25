import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import React from "react";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
// import { goerli } from "wagmi/chains";
import Header from "./components/Header";

import Hero from "./hero";
import Mint from "./mint";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

const chains = [goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "91c6a62977db67a01d779b76bc33d38f" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "Shibarium Name Service", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  return (
    <React.Fragment>
      <WagmiConfig client={wagmiClient}>
        <Header />
        <Hero />
        <Mint />
        <Footer />
        <ToastContainer />
      </WagmiConfig>

      <Web3Modal
        projectId="91c6a62977db67a01d779b76bc33d38f"
        ethereumClient={ethereumClient}
      />
    </React.Fragment>
  );
}

export default App;
