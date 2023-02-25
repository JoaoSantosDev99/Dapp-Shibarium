import styles from "./styles.module.css";

const ConnectButton = ({ title }) => {
  return <button className={styles.connect}>{title}</button>;
};

export default ConnectButton;
