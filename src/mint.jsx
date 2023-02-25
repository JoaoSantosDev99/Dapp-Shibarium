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
import abi from "./contracts/abi.json";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Mint = () => {
  const [inuptText, setInputText] = useState("");
  const [available, setAvailable] = useState(true);
  const [success, setSuccess] = useState(false);

  const notify = () => toast.success("Wow so easy!");

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

  const contractAddress = "0xBd4f34F9433eE883d85dfC3BdF71c8a3B6Ab7a61";
  const contracABI = abi;

  // const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  const contract = new ethers.Contract(contractAddress, contracABI, signer);

  // function calls
  const mint = async () => {
    console.log("mint");

    if (validateAddress(inuptText)) {
      console.log("valid");
      try {
        const register = await contract.register(inuptText);
        await register.wait();

        setSuccess(true);
        setInputText("");
      } catch (error) {
        console.log(error);
        alert("error");
      }
    }
  };

  const validateAddress = async (text) => {
    if (signer === undefined) {
      return;
    }
    const call = await contract.getAddress(text);
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
              $SNS Price: 13.37
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
                href="https://testnets.opensea.io/collection/sns-beta-test-3"
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
