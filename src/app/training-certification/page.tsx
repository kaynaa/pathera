"use client";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
// import data from "skill_course_results.json"

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("selectQuery") as string;

    console.log("User picked:", newQuery);
    setSelectedQuery(newQuery);
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
          >
            <option value={selectedQuery} className="text-[#64748B]"> 
              {selectedQuery}
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
        
        {selectedQuery=="" ? 
            (
                <div className={styles.between}>
                    <div className="text-black font-bold">Cari pelatihan yang ingin Anda dalami</div>
                    <div className="flex flex-row items-center gap-[10px]">
                        Urutkan berdasarkan:
                        <select name="orderBy" className={styles.orderBy}>
                            <option>Paling Relevan</option>
                            <option>Rating Tertinggi</option>
                        </select>
                    </div>
                </div>
            ):(
                <div className={styles.between}>
                    <div className="text-black font-bold">Hasil untuk "{selectedQuery}"</div>
                    <div className="flex flex-row items-center gap-[10px]">
                        Urutkan berdasarkan:
                        <select name="orderBy" className={styles.orderBy}>
                            <option>Paling Relevan</option>
                            <option>Rating Tertinggi</option>
                        </select>
                    </div>
                </div>
            )
        }

      </div>
      <Footer />
    </div>
  );
}
