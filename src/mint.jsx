import redirect from "./assets/redirect.png";
import MintButton from "./components/UI/MintButton";
import shiba from "./assets/InpuIcon.png";
import tag from "./assets/tag.png";
import lateralTree from "./assets/lateralTree.png";
import tower from "./assets/tower.png";
import add from "./assets/post.png";
import alert from "./assets/alert.png";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import copy from "./assets/copy.png";
import done from "./assets/check.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import error from "./assets/warning.png";

import nftabi from "./contracts/nft_abi.json";
import tokenabi from "./contracts/token_abi.json";

import { useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

const Mint = () => {
  const [copied, setCopied] = useState(false);
  const [inuptText, setInputText] = useState("");
  const [available, setAvailable] = useState(true);
  const [success, setSuccess] = useState(false);
  const [nftPrice, setNftPrice] = useState("");

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const handleInputText = (e) => {
    validateAddress(
      e.target.value
        .replace(".", "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .toLowerCase()
        .trim()
    );

    setInputText(
      e.target.value
        .replace(".", "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .toLowerCase()
        .trim()
    );
  };

  const changeCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const nftAddress = "0x2Cc4AeecB926E4B28a41dad6217aD96e0bB8845C";
  const nftAbi = nftabi;

  const tokenAddress = "0x2147a3c7B8a3D9ff4004B2938F592a6fAF0eba22";
  const tokenAbi = tokenabi;

  // const { address, isConnected } = useAccount();
  const staticProvider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli"
  );

  const readOnlyNftContract = new ethers.Contract(
    nftAddress,
    nftAbi,
    staticProvider
  );

  useEffect(() => {
    const getPrice = async () => {
      const price = await readOnlyNftContract.getPrice();
      const formatedAmount = ethers.utils.formatUnits(price, 18);
      setNftPrice(Math.trunc(formatedAmount));
    };

    console.log(chain?.id);
    getPrice();
  }, []);

  const { data: signer } = useSigner();
  const { open } = useWeb3Modal();

  const nfContract = new ethers.Contract(nftAddress, nftAbi, signer);
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

  const connectWallet = () => {
    if (chain?.id !== 5) {
      switchNetwork?.(5);
    }

    try {
      open();
    } catch (error) {
      console.log(error);
    }
  };

  // function calls
  const mint = async () => {
    if (signer === undefined) {
      connectWallet();
    }

    if (chain?.id !== 5) {
      switchNetwork?.(5);
    }

    if (inuptText === "") return;

    try {
      const targetAmount = await nfContract.getPrice();
      const formatedAmount = ethers.utils.formatUnits(targetAmount, 0);

      const approve = await tokenContract.approve(
        nftAddress,
        (formatedAmount * 1.25).toString() // formatedAmount.toString()
      );

      await approve.wait();
    } catch (error) {
      console.log(error);
    }

    if (validateAddress(inuptText)) {
      try {
        const test = await nfContract.register(inuptText);
        await test.wait();

        setSuccess(true);
        setInterval(() => {
          setSuccess(false);
        }, 15000);
        setInputText("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getTokens = async () => {
    if (chain?.id !== 5) {
      switchNetwork?.(5);
    }

    if (signer === undefined) {
      connectWallet();
    }

    try {
      await tokenContract.getTokens();
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  };

  const validateAddress = async (text) => {
    if (signer === undefined) {
      return;
    }
    const call = await nfContract.getAddress(text);
    setAvailable(call === "0x0000000000000000000000000000000000000000");
    return call === "0x0000000000000000000000000000000000000000";
  };

  return (
    <section className="w-full flex justify-center h-[800px] md:h-[1000px]">
      <div className="max-w-screen-2xl bg-[#fff4ce] px-5 w-full relative flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <div className="bg-[#fde6a1b8] z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] p-2 sm:px-10 py-5 rounded-xl">
            <h2 className="font-bold flex gap-2 justify-center items-center text-center text-xl sm:text-4xl text-[#563d1c]">
              <img src={alert} alt="alert" className="w-6 sm:w-8 h-6 sm:h-8" />
              Attention!
            </h2>
            <h2 className="font-bold flex justify-center items-center text-center text-xl sm:text-2xl text-[#563d1c]">
              This is a demo running on Goerli
            </h2>
          </div>

          <div className="bg-[#fde6a167] max-w-xl w-full z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] py-3 p-2 sm:p-10 rounded-xl">
            <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
              Mint Your Shibarium Domain Today!
            </h2>

            <div className="flex items-center gap-2 mb-4 mt-2">
              <CopyToClipboard text="0x2147a3c7B8a3D9ff4004B2938F592a6fAF0eba22">
                <button
                  onClick={changeCopy}
                  className="bg-[#ffedcade] flex gap-2 items-center text-center placeholder:text-[#dbb88c] text-[#82633b] rounded-xl h-10 px-2 italic font-bold border-[3px] border-[#be9867] outline-none"
                >
                  0x21...ba22{" "}
                  {copied ? (
                    <img src={done} alt="done" className="w-5 h-5" />
                  ) : (
                    <img src={copy} alt="copy" className="w-5 h-5" />
                  )}
                </button>
              </CopyToClipboard>
              <span className="text-[#fee8cb] bg-[#705633] border border-[#d9950ee2] shadow-lg py-2 px-3 rounded-xl font-extrabold">
                {nftPrice === ""
                  ? "Loading..."
                  : "Price: " + nftPrice + " $SNS"}
              </span>
            </div>

            <div className=" flex flex-col items-center mb-2">
              <input
                value={inuptText}
                spellCheck={false}
                placeholder="mydomain.inu"
                onChange={handleInputText}
                type="text"
                className="bg-[#ffedcade] mb-2 text-center placeholder:text-[#dbb88c] text-[#82633b] rounded-xl h-10 px-2 italic font-bold border-[3px] border-[#be9867] outline-none"
              />
              {inuptText !== "" && (
                <div>
                  {!available ? (
                    <span className="text-[#82633b] font-bold flex justify-center items-center gap-2">
                      Address already taken!
                      <img src={error} alt="error" className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="text-[#82633b] font-bold flex justify-center items-center gap-2">
                      {chain?.id !== 5 ? (
                        "Please, connect or switch to Goerli."
                      ) : (
                        <span className="flex gap-1">
                          {inuptText}.inu
                          <img src={tag} alt="tag" className="w-5 h-5" />
                        </span>
                      )}
                    </span>
                  )}
                </div>
              )}

              <img src={shiba} alt="shiba-dog" className="w-60" />
            </div>
            <MintButton active={!available} onClick={mint} />
          </div>

          {success ? (
            <div className="bg-[#fde6a1b8] z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] p-2 sm:p-10 rounded-xl">
              <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
                You just purchased a Shibarium domain!
              </h2>
              <a
                href="https://testnets.opensea.io/collection/shibariumnameservicetest"
                target="_blank"
                rel="noreferrer"
              >
                <button className="text-[#fee8cb] flex justify-center items-center gap-1 bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold">
                  Check it over here{" "}
                  <img src={redirect} alt="redirect" className="w-6 h-6" />
                </button>
              </a>
            </div>
          ) : (
            <div className="bg-[#fde6a1b8] z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] p-2 sm:px-10 py-5 rounded-xl">
              <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
                Get some testnet funds here
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={getTokens}
                  className="text-[#fee8cb] flex justify-center items-center gap-2 bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold"
                >
                  Get test $SNS
                  <img src={add} alt="redirect" className="w-5 h-5" />
                </button>

                <a
                  href="https://goerlifaucet.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="text-[#fee8cb] flex justify-center items-center gap-1 bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold">
                    Goerli Faucet
                    <img src={redirect} alt="redirect" className="w-6 h-6" />
                  </button>
                </a>
              </div>
            </div>
          )}

          {/* Testnet faucet */}
          {/* <div className="bg-[#fde6a1b8] z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] p-2 sm:px-10 py-5 rounded-xl">
            <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
              Get some testnet funds here
            </h2>
            <div className="flex gap-2">
              <button
                onClick={getTokens}
                className="text-[#fee8cb] flex justify-center items-center gap-2 bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold"
              >
                Get test $SNS
                <img src={add} alt="redirect" className="w-5 h-5" />
              </button>

              <a
                href="https://faucets.chain.link/goerli"
                target="_blank"
                rel="noreferrer"
              >
                <button className="text-[#fee8cb] flex justify-center items-center gap-1 bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold">
                  Goerli Faucet
                  <img src={redirect} alt="redirect" className="w-6 h-6" />
                </button>
              </a>
            </div>
          </div> */}
        </div>

        <img
          src={lateralTree}
          alt="tree"
          className="absolute w-[800px] right-0 top-10 z-10"
        />
        <img
          src={tower}
          alt="tree"
          className="absolute left-10 w-[300px] sm:w-[400px] sm:left-24 lg:w-[600px] bottom-0 lg:left-52 z-10"
        />
      </div>
    </section>
  );
};

export default Mint;
