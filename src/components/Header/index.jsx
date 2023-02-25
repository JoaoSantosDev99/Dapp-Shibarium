import { Web3Button } from "@web3modal/react";
import { useAccount, useSigner } from "wagmi";
import abi from "../../contracts/abi.json";
import { ethers } from "ethers";
import { useState } from "react";

import { useWeb3Modal } from "@web3modal/react";

import logo from "../../assets/Logo.png";
import mobileLogo from "../../assets/MobileLogo.png";
import ConnectButton from "../UI/ConnectButton";

const Header = () => {
  const [number, setNumber] = useState(0);
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal();

  const contractAddress = "0x5741fc5de32497F4e69aAfd0EAA268129e3A501d";

  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  const presaleContract = new ethers.Contract(contractAddress, abi, signer);

  // function calls
  const getNumber = async () => {
    const call = await presaleContract.retrieve();
    const formatedCall = ethers.utils.formatUnits(call, 0);
    setNumber(formatedCall);
  };

  const changeNumber = async () => {
    // asks the user to connect if they're not already
    if (signer === undefined) {
      return alert("Not connected");
    }

    try {
      const call = await presaleContract.store(`${Number(number) + 2}`);
      await call.wait();
      alert("success!");
    } catch (error) {
      alert(error);
    }
  };

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
