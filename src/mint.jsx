import MintButton from "./components/UI/MintButton";
import { Input } from "@material-tailwind/react";
import shiba from "./assets/InpuIcon.png";
import tag from "./assets/tag.png";

import { useState } from "react";
const Mint = () => {
  const [inuptText, setInputText] = useState("");

  const handleInputText = (e) => {
    setInputText(e.target.value.replace(".", ""));
  };

  return (
    <section className="w-full flex justify-center min-h-screen border">
      <div className="max-w-screen-lg px-5 w-full flex justify-center items-center">
        <div className="bg-[#fde6a19f] flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-xl border-[3px] border-[#c08644] p-2 sm:p-10 rounded-xl">
          <h2 className="font-bold text-center text-xl sm:text-2xl text-[#563d1c]">
            Mint Your Shibarium Domain Today!
          </h2>
          <span className="text-[#fee8cb] bg-[#705633] border border-[#d9950ee2] mt-2 shadow-lg py-2 px-3 rounded-xl font-extrabold mb-10">
            $SNS Price: 13.37
          </span>
          <div className=" flex flex-col items-center mb-2">
            <input
              value={inuptText}
              autoCorrect={false}
              spellCheck={false}
              placeholder="mydomain.inu"
              onChange={handleInputText}
              type="text"
              className="bg-[#ffedcade] mb-2 text-center placeholder:text-[#dbb88c] text-[#82633b] rounded-xl h-10 px-2 italic font-bold border-[3px] border-[#be9867] outline-none"
            />
            {inuptText !== "" && (
              <span className="text-[#82633b] font-bold flex justify-center items-center gap-2">
                {inuptText}.inu <img src={tag} alt="" className="w-5 h-5" />
              </span>
            )}

            <img src={shiba} alt="shiba-dog" className="w-60" />
          </div>
          <MintButton />
        </div>
      </div>
    </section>
  );
};

export default Mint;
