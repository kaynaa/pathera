import Link from 'next/link';
import styles from './Header.module.css';
import { Bell, CircleUserRound, ChevronDown } from 'lucide-react';
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";

interface HeaderProps {
    pageName: string; // Nama halaman untuk menentukan link aktif
}

type UserData = {
  fullName: string;
};

export default function Header({ pageName }: HeaderProps) {
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Efek untuk mengambil data dari Firestore saat pengguna login
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Membuat referensi ke dokumen pengguna di Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Jika dokumen ada, simpan datanya ke state
          setUserData(userDoc.data() as UserData);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [user]); // Jalankan efek ini setiap kali 'user' berubah

  // Menampilkan pesan loading saat AuthContext sedang memeriksa status login
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  const isLoggedIn = !!user;

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
                            {userData?.fullName || ""}
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
