import styles from "./styles.module.css";

const MintButton = ({ onClick, active }) => {
  return (
    <button disabled={active} className={styles.mint} onClick={onClick}>
      {active ? <span className="text-[35px]">&#9888;</span> : "Mint"}
    </button>
  );
};

export default MintButton;
