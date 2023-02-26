import redirect from "./assets/redirect.png";
import MintButton from "./components/UI/MintButton";
import shiba from "./assets/InpuIcon.png";
import tag from "./assets/tag.png";
import error from "./assets/warning.png";
import lateralTree from "./assets/lateralTree.png";
import tower from "./assets/tower.png";
import { useState } from "react";
import { useSigner } from "wagmi";
import { ethers } from "ethers";

import nftabi from "./contracts/nft_abi.json";
import tokenabi from "./contracts/token_abi.json";

const Mint = () => {
  const [inuptText, setInputText] = useState("");
  const [available, setAvailable] = useState(true);
  const [success, setSuccess] = useState(false);
  const [nftPrice, setNftPrice] = useState("");

  const handleInputText = (e) => {
    validateAddress(
      e.target.value
        .replace(".", "")
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase()
        .trim()
    );

    setInputText(
      e.target.value
        .replace(".", "")
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase()
        .trim()
    );
  };

  const nftAddress = "0x5E8e515A94e776D294AB3BCc6044614C65E12e09";
  const nftAbi = nftabi;

  const tokenAddress = "0xb0B1a517a507fAaD738d8f4C34D8432a460e78f3";
  const tokenAbi = tokenabi;

  // const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  const nfContract = new ethers.Contract(nftAddress, nftAbi, signer);
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

  // function calls
  const mint = async () => {
    console.log("mint");
    if (inuptText === "") return;

    try {
      console.log("approve");
      const targetAmount = await nfContract.getPrice();
      const formatedAmount = ethers.utils.formatUnits(targetAmount, 0);
      console.log(formatedAmount * 1.25);
      console.log(formatedAmount);

      const approve = await tokenContract.approve(
        nftAddress,
        (formatedAmount * 1.25).toString() // formatedAmount.toString()
      );

      await approve.wait();
    } catch (error) {
      console.log(error);
    }

    if (validateAddress(inuptText)) {
      console.log("valid");
      try {
        const register = await nfContract.register(inuptText);
        await register.wait();

        setSuccess(true);
        setInputText("");
      } catch (error) {}
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
          <div className="bg-[#fde6a167] z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] p-2 sm:p-10 rounded-xl">
            <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
              Mint Your Shibarium Domain Today!
            </h2>

            <span className="text-[#fee8cb] bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold mb-10">
              .INU Price: {nftPrice === "" ? "Loading..." : nftPrice}
            </span>
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
                      {inuptText}.inu
                      <img src={tag} alt="tag" className="w-5 h-5" />
                    </span>
                  )}
                </div>
              )}

              <img src={shiba} alt="shiba-dog" className="w-60" />
            </div>
            <MintButton active={!available} onClick={mint} />
          </div>
          {success && (
            <div className="bg-[#fde6a1b8] z-20 flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-md border-[3px] border-[#c08644] p-2 sm:p-10 rounded-xl">
              <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
                You just purchased a Shibarium domain!
              </h2>
              <a
                href="https://testnets.opensea.io/collection/sns-beta-test-4"
                target="_blank"
                rel="noreferrer"
              >
                <button className="text-[#fee8cb] flex justify-center items-center gap-1 bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold">
                  Check it over here{" "}
                  <img src={redirect} alt="redirect" className="w-6 h-6" />
                </button>
              </a>
            </div>
          )}
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
