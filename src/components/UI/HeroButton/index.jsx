import styles from "./styles.module.css";

const HeroButton = ({ title }) => {
  return <button className={styles.hero}>{title}</button>;
};

export default HeroButton;
