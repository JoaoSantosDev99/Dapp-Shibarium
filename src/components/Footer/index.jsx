import discord from "../../assets/Socials/discordia.png";
import telegram from "../../assets/Socials/telegram.png";
import twitter from "../../assets/Socials/twitter.png";
import medium from "../../assets/Socials/medium.png";

const Footer = () => {
  return (
    <footer className="w-full flex text-[#563d1c] justify-center py-8 bg-[#ffe9b5]">
      <div className="max-w-screen-lg w-full flex flex-col items-center">
        <h2 className="font-bold text-2xl sm:text-4xl">
          Shibarium Name Service
        </h2>
        <p>Build fast, host and deliver.</p>
        <ul className="flex justify-center gap-2 mb-10 mt-3">
          <li>
            <a href="https://t.me/dogtag_id" target="_blank" rel="noreferrer">
              <img src={telegram} alt="telegram" className="w-10" />
            </a>
          </li>
          <li>
            <a title="Coming Soon!">
              <img src={discord} alt="discord" className="w-10" />
            </a>
          </li>
          <li>
            <a title="Coming Soon!">
              <img src={twitter} alt="twitter" className="w-10" />
            </a>
          </li>
          <li>
            <a title="Coming Soon!">
              <img src={medium} alt="medium" className="w-10" />
            </a>
          </li>
        </ul>
        <span className="font-medium italic">
          &trade; Shibarium 2023, All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
