import styles from "./QuantitySelector.module.css";

export default function QuantitySelector({
  value,
  onChange,
  max = 99,
  min = 1,
}) {
  function decrease() {
    if (value > min) onChange(value - 1);
  }

  function increase() {
    if (value < max) onChange(value + 1);
  }

  function handleInput(e) {
    const num = Number(e.target.value);
    if (Number.isNaN(num)) return;
    if (num < min) onChange(min);
    else if (num > max) onChange(max);
    else onChange(num);
  }

  return (
    <div className={styles.wrap} role="group" aria-label="اختيار الكمية">
      <button
        type="button"
        className={styles.btn}
        onClick={decrease}
        disabled={value <= min}
        aria-label="تقليل الكمية"
      >
        −
      </button>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={handleInput}
        min={min}
        max={max}
        aria-label="الكمية"
      />
      <button
        type="button"
        className={styles.btn}
        onClick={increase}
        disabled={value >= max}
        aria-label="زيادة الكمية"
      >
        +
      </button>
    </div>
  );
}
