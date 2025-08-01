// src/components/CreatePostModal.tsx
"use client";

import { useState, useEffect } from "react"; // Impor useEffect
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import styles from "./CreatePostModal.module.css";
import { X } from "lucide-react";

type CreatePostModalProps = {
  onClose: () => void;
  onPostSuccess: () => void;
};

const MAX_CHARS = 500;

export default function CreatePostModal({
  onClose,
  onPostSuccess,
}: CreatePostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // PERBAIKAN: State baru untuk menyimpan nama penulis
  const [authorName, setAuthorName] = useState("Memuat nama...");

  // PERBAIKAN: Mengambil nama pengguna dari Firestore saat komponen dimuat
  useEffect(() => {
    const fetchAuthorName = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setAuthorName(userDoc.data().fullName);
        } else {
          setAuthorName(user.displayName || "Pengguna Anonim");
        }
      }
    };
    fetchAuthorName();
  }, [user]); // Jalankan setiap kali user berubah

  const handlePost = async () => {
    if (!user || !content.trim()) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        authorName: authorName, // Gunakan nama dari state
        authorId: user.uid,
        content: content,
        createdAt: serverTimestamp(),
        replyCount: 0,
      });

      onPostSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Create Question</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.authorInfo}>
          {/* PERBAIKAN: Menampilkan nama dari state */}
          <p>
            {authorName} • <span>Sekarang</span>
          </p>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Kendala kerja jadi data analyst apa ?"
          className={styles.textarea}
          maxLength={MAX_CHARS}
        />
        <div className={styles.footer}>
          <span className={styles.charCount}>
            {content.length}/{MAX_CHARS}
          </span>
          <button
            onClick={handlePost}
            className={styles.postButton}
            disabled={isLoading}
          >
            {isLoading ? "Memposting..." : "Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
