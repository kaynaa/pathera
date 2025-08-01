// src/app/community-space/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import SuccessPopup from "@/components/SuccessPopup";
import styles from "./page.module.css";
import { Search, Plus } from "lucide-react";

export type Post = {
  id: string;
  authorName: string;
  authorId: string;
  content: string;
  createdAt: Timestamp;
  replyCount: number;
};

export default function CommunitySpacePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  // PERBAIKAN: State baru untuk menyimpan kata kunci pencarian
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePostSuccess = () => {
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2000);
  };

  // PERBAIKAN: Logika untuk memfilter postingan berdasarkan searchTerm
  const filteredPosts = useMemo(() => {
    if (!searchTerm) {
      return posts; // Jika tidak ada pencarian, tampilkan semua
    }
    return posts.filter((post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, posts]);

  return (
    <>
      <Header pageName="community-space" />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Community Space</h1>
          <p className={styles.subtitle}>
            Diskusi dengan komunitas profesional
          </p>

          <div className={styles.actionsContainer}>
            <div className={styles.searchBarContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                // PERBAIKAN: Hubungkan input dengan state
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className={styles.createButton}
              >
                <Plus size={20} />
                <span>Create Question</span>
              </button>
            )}
          </div>

          <div className={styles.postsList}>
            {isLoading ? (
              <p>Memuat postingan...</p>
            ) : (
              // PERBAIKAN: Tampilkan hasil yang sudah difilter
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostSuccess={handlePostSuccess}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup message="Diskusi Berhasil Diposting" />
      )}
    </>
  );
}
