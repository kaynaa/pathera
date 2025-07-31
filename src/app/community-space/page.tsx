// src/app/community-space/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import styles from "./page.module.css";
import { Search } from "lucide-react";

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
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim()) return;

    try {
      // PERBAIKAN: Ambil nama pengguna dari Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const authorName = userDoc.exists()
        ? userDoc.data().fullName
        : user.displayName || "Anonymous";

      await addDoc(collection(db, "posts"), {
        authorName: authorName,
        authorId: user.uid,
        content: newPostContent,
        createdAt: serverTimestamp(),
        replyCount: 0,
      });
      setNewPostContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <Header pageName="community-space" />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Community Space</h1>
          <p className={styles.subtitle}>
            Diskusi dengan komunitas profesional
          </p>

          {/* PERBAIKAN: Search bar dengan ikon */}
          <div className={styles.searchBarContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>

          {user && (
            <form onSubmit={handleCreatePost} className={styles.createPostForm}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Buat pertanyaan baru..."
                className={styles.textarea}
              />
              <button type="submit" className={styles.button}>
                Create Question
              </button>
            </form>
          )}

          <div className={styles.postsList}>
            {isLoading ? (
              <p>Memuat postingan...</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
