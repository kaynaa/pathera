// src/components/ContactForm.tsx
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  return (
    <section className={styles.contact}>
      <h2 className={styles.title}>Hubungi Kami</h2>
      <p className={styles.subtitle}>
        Kami siap membantu Anda dengan pertanyaan, masukan, atau kebutuhan
        lainnya.
      </p>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            NAMA
          </label>
          <input
            type="text"
            id="name"
            placeholder="Masukkan Nama Anda"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan Email Anda"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            PESAN
          </label>
          <textarea
            id="message"
            placeholder="Masukkan Pesan Anda"
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.button}>
          Kirim Pesan
        </button>
      </form>
    </section>
  );
}
