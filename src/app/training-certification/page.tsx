"use client";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import CourseResults from "@/components/CourseResults";

type courseContent = {
  title: string;
  organization: string;
  rating: number;
  skills: string;
  difficulty: string;
  duration: string;
  link: string;
}

type courseData = {
  query: string;
  results: courseContent[];
}

export default function trainingPage() {
  const skillOptions = [
    "Accounting", "Android", "Artificial Intelligence", "Cloud Computing",
    "Communication Skills", "Cybersecurity", "Excel", "Graphic Design",
    "HR", "iOS", "Java", "JavaScript", "Machine Learning", "Marketing",
    "Math", "Network", "Networking", "OOP", "Power BI", "Presentation Skills",
    "Project Management", "Python", "SEO", "Social Media", "SQL",
    "Statistics", "Web Development"
  ];
  const [data, setData] = useState<courseData[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/skill_course_results.json');
    const json = await res.json();
    setData(json);
  };
  fetchData();
}, []);
  
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedQuery(selectedQuery);
  };

  return (
    <div className={styles.main}>
      <Header pageName="training" />
      <div className="p-8"></div>

      <div className={styles.trainingPage}>
        <div className={styles.title}>Training and Certification</div>
        <div className={styles.subtitle}>Ikuti pelatihan bersertifikat sesuai dengan minat dan karir</div>

        <form onSubmit={handleSubmit} className={styles.between}>
          <select 
            name="selectQuery" 
            value={selectedQuery} 
            className={styles.inputField}
            onChange={(e) => setSelectedQuery(e.target.value)}
          >
            <option value="" className="text-[#64748B]"> 
              Pilih skill yang Anda minati
            </option>
            {data.map((item) => (
              <option key={item.query} value={item.query}>
                {item.query}
              </option>
            ))}
          </select>

          <button 
            className={styles.showResult}
            type="submit"
          >
            Tampilkan Rekomendasi
          </button>
        </form>

        {submittedQuery && (
          <CourseResults query={submittedQuery} />
        )}
        
      </div>
      <Footer />
    </div>
  );
}
