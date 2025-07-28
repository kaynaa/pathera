import Link from 'next/link';
import styles from './Header.module.css';
import { Bell, CircleUserRound, ChevronDown } from 'lucide-react';


interface HeaderProps {
    isLoggedIn: boolean;
    pageName: string; // Nama halaman untuk menentukan link aktif
    userName?: string; // Optional, hanya ada jika pengguna sudah login
}

export default function Header({ isLoggedIn, pageName, userName }: HeaderProps) {
  return (
    <div className={styles.header}>
        <div className={styles.left_container}>
            <img src="/white-logo.png" alt="Pathera Logo" className={styles.logo}/>
           
            <Link href="/" className={`styles.nav ${pageName === 'home' ? styles.nav_active : styles.nav}`}>
                Beranda
            </Link>
            <Link href="/career" className={`styles.nav ${pageName === 'career' ? styles.nav_active : styles.nav}`}>
                Career
            </Link>
            <Link href="/training-certification" className={`styles.nav ${pageName === 'training' ? styles.nav_active : styles.nav}`}>
                Training & Certification
            </Link>
            <Link href="/community-space" className={`styles.nav ${pageName === 'community' ? styles.nav_active : styles.nav}`}>
                Community Space
            </Link>
            <Link href="/about-us" className={`styles.nav ${pageName === 'about-us' ? styles.nav_active : styles.nav}`}>
                About Us
            </Link>
        </div>

        <div className={styles.right_container}>
            {isLoggedIn ? (
                <>  
                    <div className={styles.right_container}>
                        {/*To-do: Add dropdown menu for notifications */}
                        <Link href="/notification">
                            <Bell size={25} fill="white"/>
                        </Link>
                        <Link href="/profile">
                            <CircleUserRound size={25}/>
                        </Link>
                        {/*To-do: Add dropdown menu for user profile */}
                        <Link href="/profile" className={styles.username_display}>
                            {userName}
                            <ChevronDown size={25} />
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    
                    <Link href="/login" className={styles.login_link}>
                        <div className={styles.login_button}>
                            Login
                        </div>
                    </Link>
                    <Link href="/signup" className={styles.signup_link}>
                        <div className={styles.signup_button}>
                            Sign Up
                        </div>
                    </Link>
                </>
            )}
        </div>
    </div>
  );
}
