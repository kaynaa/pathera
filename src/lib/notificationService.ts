// src/lib/notificationService.ts
import { db } from "@/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc, Timestamp } from "firebase/firestore";

// Fungsi untuk membuat notifikasi rekomendasi karir secara berkala
export const createPeriodicCareerNotification = async (userId: string) => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) return;

        const userData = userDoc.data();
        const lastNotifTimestamp = userData.lastCareerRecommendationTimestamp as Timestamp | undefined;

        // Cek kapan notifikasi terakhir dikirim
        if (lastNotifTimestamp) {
            const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
            const lastNotifDate = lastNotifTimestamp.toDate();
            const now = new Date();
            
            // Jika belum 7 hari, hentikan fungsi
            if (now.getTime() - lastNotifDate.getTime() < sevenDaysInMillis) {
                console.log("Rekomendasi karir baru dikirim kurang dari 7 hari yang lalu. Melewati...");
                return;
            }
        }

        // Jika belum pernah ada notifikasi atau sudah lebih dari 7 hari, buat notifikasi baru
        const notificationsRef = collection(userRef, "notifications");
        await addDoc(notificationsRef, {
            message: `Rekomendasi karir terbaru telah tersedia untukmu!`,
            link: '/career', // Arahkan ke halaman karir
            timestamp: serverTimestamp(),
            isRead: false,
            type: 'periodic_career' // Tipe baru
        });

        // Update timestamp notifikasi terakhir di profil user
        await updateDoc(userRef, {
            lastCareerRecommendationTimestamp: serverTimestamp()
        });
        
        console.log(`Notifikasi karir periodik berhasil dibuat untuk user ${userId}`);

    } catch (error) {
        console.error("Gagal membuat notifikasi karir periodik:", error);
    }
};