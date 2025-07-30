import styles from "./ToggleSlider.module.css";

type ToggleSliderProps = {
  value: boolean;
  onToggle: () => void;
};

export default function ToggleSlider({ value, onToggle }: ToggleSliderProps) {
  return (
    <div onClick={onToggle}>
      {value ? (
        <div className={styles.activeSlider}>
          <div className={styles.innerActiveSlider}></div>
        </div>
      ) : (
        <div className={styles.inactiveSlider}>
          <div className={styles.innerInactiveSlider}></div>
        </div>
      )}
    </div>
  );
}
