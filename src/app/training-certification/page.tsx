"use client";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function trainingPage(){
    return(
        <div className={styles.main}>
            <Header pageName="training" />
            <div className={styles.trainingPage}>
                <div className={styles.title}>Training and Certification</div>
                <div>Ikuti pelatihan bersertifikat sesuai dengan minat dan karir</div>
            </div>
            <Footer />
        </div>
    );
}