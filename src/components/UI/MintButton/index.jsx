import styles from "./styles.module.css";

const MintButton = ({ onClick }) => {
  return (
    <button className={styles.mint} onClick={onClick}>
      Mint
    </button>
  );
};

export default MintButton;
