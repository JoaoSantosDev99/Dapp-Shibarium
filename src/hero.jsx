import hero from "./assets/hero.png";
import HeroButton from "./components/UI/HeroButton";

const Hero = () => {
  return (
    <section className="w-full flex justify-center px-2">
      <div className="max-w-screen-2xl w-full flex flex-col items-center text-white">
        <div className="flex flex-col items-center mt-40">
          <ul className="text-[45px] text-[#563d1c] leading-[45px] lg:text-[55px] font-bold flex flex-col items-center lg:leading-[60px]">
            <li>Your key to a </li>
            <li>Shibarium.inu</li>
            <li>Address</li>
          </ul>
          <ul className="flex gap-2 mt-5">
            <a title="coming soon">
              <HeroButton title="Lite Paper" />
            </a>
            <a href="https://t.me/dogtag_id" target="_blank" rel="noreferrer">
              <HeroButton title="Telegram" />
            </a>
          </ul>
          <p className="max-w-lg lg:max-w-2xl text-[#78572d] font-bold text-center text-lg lg:text-2xl mt-5">
            Every .inu domain represents your wallet so you can receive crypto,
            NFTs and just about anything else in the Shibarium Metaverse
          </p>
        </div>
        <img src={hero} alt="samurai" className="w-[800px]" />
      </div>
    </section>
  );
};

export default Hero;
