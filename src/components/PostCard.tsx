// src/components/PostCard.tsx
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
  updateDoc,
  increment,
  Timestamp,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import styles from "./PostCard.module.css";
import {
  MessageSquare,
  Share2,
  MoreHorizontal,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";

export type Post = {
  id: string;
  authorName: string;
  authorId: string;
  content: string;
  createdAt: Timestamp;
  replyCount: number;
};

type PostCardProps = {
  post: Post;
};

type Reply = {
  id: string;
  authorName: string;
  content: string;
  createdAt: Timestamp;
};

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useEffect(() => {
    if (showReplies) {
      const repliesQuery = query(
        collection(db, `posts/${post.id}/replies`),
        orderBy("createdAt", "asc")
      );
      const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
        const repliesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Reply)
        );
        setReplies(repliesData);
      });
      return () => unsubscribe();
    }
  }, [showReplies, post.id]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReplyContent.trim()) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const authorName = userDoc.exists()
        ? userDoc.data().fullName
        : "Pengguna Anonim";

      const repliesCollection = collection(db, `posts/${post.id}/replies`);
      await addDoc(repliesCollection, {
        authorName: authorName,
        authorId: user.uid,
        content: newReplyContent,
        createdAt: serverTimestamp(),
      });

      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        replyCount: increment(1),
      });

      if (user.uid !== post.authorId) {
        const userToNotifyRef = doc(db, "users", post.authorId);
        const notificationRef = collection(userToNotifyRef, "notifications");

        await addDoc(notificationRef, {
          message: `${authorName} membalas komentar Anda di community space`,
          link: `/community-space`,
          timestamp: serverTimestamp(),
          isRead: false,
        });
      }

      setNewReplyContent("");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || user.uid !== post.authorId) return;
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus postingan ini?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "posts", post.id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Baru saja";
    const date = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className={styles.card}>
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <UserCircle2 size={40} className={styles.avatarIcon} />
          <div>
            <span className={styles.authorName}>{post.authorName}</span>
            <span className={styles.timestamp}>
              • {formatTime(post.createdAt)}
            </span>
          </div>
        </div>
        <div className={styles.optionsContainer}>
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className={styles.optionsButton}
          >
            <MoreHorizontal size={20} />
          </button>
          {showOptionsMenu && user && user.uid === post.authorId && (
            <div className={styles.optionsMenu}>
              <button onClick={handleDeletePost}>Hapus</button>
            </div>
          )}
        </div>
      </div>
      <p className={styles.postContent}>{post.content}</p>
      <div className={styles.postActions}>
        <button
          className={styles.actionButton}
          onClick={() => setShowReplies(!showReplies)}
        >
          <MessageSquare size={16} />
          <span>{post.replyCount || 0} replies</span>
        </button>
        <button className={styles.actionButton}>
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>
      </div>
      {showReplies && (
        <div className={styles.repliesSection}>
          {!user && (
            <div className={styles.loginPrompt}>
              <UserCircle2 size={24} />
              <span>
                Silahkan Login terlebih dahulu untuk dapat berinteraksi di
                community space
              </span>
              <Link href="/login" className={styles.loginLink}>
                KLIK DISINI
              </Link>
            </div>
          )}
          {user && (
            <form onSubmit={handleReplySubmit} className={styles.replyForm}>
              <input
                type="text"
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                placeholder="Tambahkan Komentar"
                className={styles.replyInput}
              />
            </form>
          )}
          <div
            className={`${styles.repliesList} ${
              !user ? styles.repliesBlurred : ""
            }`}
          >
            <p className={styles.commentHeader}>Komentar</p>
            {replies.map((reply) => (
              <div key={reply.id} className={styles.reply}>
                <div className={styles.authorInfo}>
                  <UserCircle2 size={40} className={styles.avatarIcon} />
                  <div>
                    <span className={styles.authorName}>
                      {reply.authorName}
                    </span>
                    <span className={styles.timestamp}>
                      • {formatTime(reply.createdAt)}
                    </span>
                  </div>
                </div>
                <p className={styles.replyContent}>{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
