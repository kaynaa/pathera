// src/components/PostCard.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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

// Tipe data untuk Postingan Utama
export type Post = {
  id: string;
  authorName: string;
  authorId: string;
  content: string;
  createdAt: Timestamp;
  replyCount: number;
};

// Tipe data untuk Balasan
type Reply = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Timestamp;
  parentId: string | null;
};

// --- Komponen terpisah untuk satu balasan (Reply) ---
const ReplyComponent = ({
  reply,
  postId,
  onReply,
}: {
  reply: Reply;
  postId: string;
  onReply: (replyId: string, authorName: string) => void;
}) => {
  const { user } = useAuth();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleDeleteReply = async () => {
    if (!user || user.uid !== reply.authorId) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus balasan ini?")) {
      try {
        await deleteDoc(doc(db, `posts/${postId}/replies`, reply.id));
        await updateDoc(doc(db, "posts", postId), {
          replyCount: increment(-1),
        });
      } catch (error) {
        console.error("Error deleting reply:", error);
      }
    }
  };

  return (
    <div className={styles.reply}>
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <UserCircle2 size={32} className={styles.avatarIcon} />
          <div>
            <span className={styles.authorName}>{reply.authorName}</span>
            <span className={styles.timestamp}>
              • {formatTime(reply.createdAt)}
            </span>
          </div>
        </div>
        {user && user.uid === reply.authorId && (
          <div className={styles.optionsContainer}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className={styles.optionsButton}
            >
              <MoreHorizontal size={20} />
            </button>
            {showOptionsMenu && (
              <div className={styles.optionsMenu}>
                <button
                  onClick={handleDeleteReply}
                  className={styles.deleteButton}
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className={styles.replyContent}>{reply.content}</p>
      <div className={styles.postActions}>
        <button
          onClick={() => onReply(reply.id, reply.authorName)}
          className={styles.actionButton}
        >
          <MessageSquare size={16} />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
};

// --- Komponen Utama PostCard ---
export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [allReplies, setAllReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });
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
        setAllReplies(repliesData);
      });
      return () => unsubscribe();
    }
  }, [showReplies, post.id]);

  const nestedReplies = useMemo(() => {
    const replyMap = new Map<string, Reply[]>();
    const topLevelReplies: Reply[] = [];

    allReplies.forEach((reply) => {
      if (reply.parentId) {
        if (!replyMap.has(reply.parentId)) {
          replyMap.set(reply.parentId, []);
        }
        replyMap.get(reply.parentId)!.push(reply);
      } else {
        topLevelReplies.push(reply);
      }
    });

    return { topLevelReplies, replyMap };
  }, [allReplies]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReplyContent.trim()) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const authorName = userDoc.exists()
        ? userDoc.data().fullName
        : "Pengguna Anonim";

      await addDoc(collection(db, `posts/${post.id}/replies`), {
        authorName: authorName,
        authorId: user.uid,
        content: newReplyContent,
        createdAt: serverTimestamp(),
        parentId: replyingTo.id,
      });

      await updateDoc(doc(db, "posts", post.id), {
        replyCount: increment(1),
      });

      setNewReplyContent("");
      setReplyingTo({ id: null, name: null });
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || user.uid !== post.authorId) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
      try {
        await deleteDoc(doc(db, "posts", post.id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  // PERBAIKAN: Fungsi untuk menangani share
  const handleShare = async () => {
    const shareData = {
      title: "Pathera Community Post",
      text: `Lihat postingan dari ${post.authorName}: "${post.content}"`,
      url: window.location.href, // Menggunakan URL halaman saat ini
    };

    try {
      // Menggunakan Web Share API jika didukung
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Salin link ke clipboard jika tidak didukung
        await navigator.clipboard.writeText(shareData.url);
        alert("Link postingan telah disalin ke clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
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
              <button
                onClick={handleDeletePost}
                className={styles.deleteButton}
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
      <p className={styles.postContent}>{post.content}</p>
      <div className={styles.postActions}>
        <button
          className={styles.actionButton}
          onClick={() => {
            setShowReplies(!showReplies);
            setReplyingTo({ id: null, name: null });
          }}
        >
          <MessageSquare size={16} />
          <span>{post.replyCount || 0} replies</span>
        </button>
        {/* PERBAIKAN: Menambahkan onClick handler */}
        <button className={styles.actionButton} onClick={handleShare}>
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>
      </div>

      {showReplies && (
        <div className={styles.repliesSection}>
          {user ? (
            <form onSubmit={handleReplySubmit} className={styles.replyForm}>
              <UserCircle2 size={32} className={styles.avatarIcon} />
              <input
                type="text"
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                placeholder={
                  replyingTo.id
                    ? `Balas ke ${replyingTo.name}...`
                    : "Tambahkan Komentar"
                }
                className={styles.replyInput}
              />
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <UserCircle2 size={24} />
              <span>
                Silahkan Login terlebih dahulu untuk dapat berinteraksi
              </span>
              <Link href="/login" className={styles.loginLink}>
                KLIK DISINI
              </Link>
            </div>
          )}

          <div
            className={`${styles.repliesList} ${
              !user ? styles.repliesBlurred : ""
            }`}
          >
            <p className={styles.commentHeader}>Komentar</p>
            {nestedReplies.topLevelReplies.map((reply) => (
              <div key={reply.id}>
                <ReplyComponent
                  reply={reply}
                  postId={post.id}
                  onReply={(replyId, authorName) =>
                    setReplyingTo({ id: replyId, name: authorName })
                  }
                />
                {nestedReplies.replyMap.get(reply.id)?.map((nestedReply) => (
                  <div key={nestedReply.id} className={styles.nestedReply}>
                    <ReplyComponent
                      reply={nestedReply}
                      postId={post.id}
                      onReply={(replyId, authorName) =>
                        setReplyingTo({ id: replyId, name: authorName })
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Fungsi format waktu (bisa diletakkan di luar komponen)
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
