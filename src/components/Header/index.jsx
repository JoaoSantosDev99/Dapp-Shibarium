import { Web3Button } from "@web3modal/react";
import { useAccount, useSigner } from "wagmi";
import nftAbi from "../../contracts/nft_abi.json";
import { ethers } from "ethers";
import { useState } from "react";

import { useWeb3Modal } from "@web3modal/react";

import logo from "../../assets/Logo.png";
import ConnectButton from "../UI/ConnectButton";

const Header = () => {
  const { open } = useWeb3Modal();

  const { address, isConnected } = useAccount();

  return (
    <header className="w-full flex justify-center items-center">
      <div className="max-w-screen-2xl w-full shadow-2xl flex justify-center p-1 sm:p-2 bg-[#FFF4CE]">
        <div className="flex bg-[#a48253] text-[#FFF3C6] rounded-2xl sm:py-4 py-2 sm:px-5 px-2 justify-between items-center max-w-screen-2xl w-full">
          <h1 className="flex items-center  justify-center">
            <img src={logo} alt="" className="w-52" />
          </h1>
          {isConnected ? (
            <ConnectButton
              title={address.slice(0, 4) + " ... " + address.slice(-4)}
            />
          ) : (
            // <Web3Button />
            <div>
              {" "}
              <div className="hidden sm:flex">
                <ConnectButton title={"Connect Wallet"} onClick={open} />
              </div>
              <div className="sm:hidden">
                <ConnectButton title={"Connect"} onClick={open} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
