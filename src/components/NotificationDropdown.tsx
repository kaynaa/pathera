// src/components/NotificationDropdown.tsx
import React from "react";
import Link from "next/link";
import styles from "./NotificationDropdown.module.css";
import { Notification } from "./Header"; // Impor tipe data dari Header

interface NotificationDropdownProps {
  notifications: Notification[];
}

const NotificationDropdown = ({ notifications }: NotificationDropdownProps) => {
  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.header}>
        <h3>Notifikasi</h3>
      </div>
      <ul className={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li key={notif.id} className={styles.notificationItem}>
              <Link href={notif.link} className={styles.notificationLink}>
                {notif.message}
              </Link>
            </li>
          ))
        ) : (
          <li className={styles.noNotification}>Tidak ada notifikasi baru.</li>
        )}
      </ul>
      <div className={styles.footer}>
        <Link href="/notification" className={styles.viewAllLink}>
          Lihat Semua Notifikasi
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
