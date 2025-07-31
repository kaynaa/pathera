
import Image from "next/image";
import styles from "./CourseResults.module.css";
import { useEffect, useState } from "react";

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



export default function CourseResults({ query }: { query: string }) {
    const skillOptions = [
        "Accounting", "Android", "Artificial Intelligence", "Cloud Computing",
        "Communication Skills", "Cybersecurity", "Excel", "Graphic Design",
        "HR", "iOS", "Java", "JavaScript", "Machine Learning", "Marketing",
        "Math", "Network", "Networking", "OOP", "Power BI", "Presentation Skills",
        "Project Management", "Python", "SEO", "Social Media", "SQL",
        "Statistics", "Web Development"
    ];
    const [orderBy, setOrderBy] = useState<string>("Paling Relevan");
    const [data, setData] = useState<courseData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/skill_course_results.json');
            const json = await res.json();
            setData(json);
        };
        fetchData();
    }, []);

  return (
    <div className={styles.main}>

    { query=="" ? 
            (
                <div className={styles.between}>
                    <div className="text-black font-bold">Cari pelatihan yang ingin Anda dalami</div>
                    <div className="flex flex-row items-center gap-[10px]">
                        Urutkan berdasarkan:
                        <select 
                            name="orderBy" 
                            className={styles.orderBy}
                            value={orderBy}
                            onChange={(e) => setOrderBy(e.target.value)}
                            >                        
                            <option value="Paling Relevan">Paling Relevan</option>
                            <option value="Rating Tertinggi">Rating Tertinggi</option>
                        </select>
                    </div>
                </div>
            ):(
                <div className={styles.between}>
                    <div className="text-black font-bold">Hasil untuk "{query}"</div>
                    <div className="flex flex-row items-center gap-[10px]">
                        Urutkan berdasarkan:
                        <select 
                            name="orderBy" 
                            className={styles.orderBy}
                            value={orderBy}
                            onChange={(e) => setOrderBy(e.target.value)}
                            >                        
                            <option value="Paling Relevan">Paling Relevan</option>
                            <option value="Rating Tertinggi">Rating Tertinggi</option>
                        </select>
                    </div>
                </div>
            )
        }

        
      
    </div>
  );
}
