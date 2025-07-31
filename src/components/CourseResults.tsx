
import Image from "next/image";
import styles from "./CourseResults.module.css";
import CourseCard from "./CourseCard";
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

    const combinedResults: courseContent[] = [];
    const seen = new Set<string>();
    data.forEach(item => {
    item.results.forEach(results => {
        const key = JSON.stringify(results);
        if (!seen.has(key)) {
            seen.add(key);
            combinedResults.push(results);
        }
    });
    });
    const sortedAllResults = [...combinedResults];
    if (orderBy === "Rating Tertinggi") {
        sortedAllResults.sort((a, b) => b.rating - a.rating); // highest rating
    } else if (orderBy === "Rating Terendah") {
        sortedAllResults.sort((a, b) => a.rating - b.rating); // lowest rating
    }

    const courses = data.find(item => item.query === query)?.results || [];
    const sortedCourses = [...courses];
    if (orderBy === "Rating Tertinggi") {
        sortedCourses.sort((a, b) => b.rating - a.rating); // highest rating
    } else if (orderBy === "Rating Terendah") {
        sortedCourses.sort((a, b) => a.rating - b.rating); // lowest rating
    }

  return (
    <div className={styles.main}>

    { query=="-" ? 
            (   <>
                <div className={styles.between}>
                    <div className="text-black font-bold">Cari pelatihan yang ingin Anda dalami</div>
                    <div className="flex flex-row items-center gap-[10px]">
                        Urutkan berdasarkan:
                        <select 
                            name="orderBy" 
                            className={styles.orderBy}
                            value={orderBy}
                            onChange={(e) => setOrderBy(e.target.value)}>                        
                            <option value="Paling Relevan">Paling Relevan</option>
                            <option value="Rating Tertinggi">Rating Tertinggi</option>
                            <option value="Rating Terendah">Rating Terendah</option>
                        </select>
                    </div>
                </div>
                <div className={styles.cardContainer}>
                    {sortedAllResults.map((item) => (
                        <CourseCard key={item.title} course={item} />
                    ))}
                </div>
                <div className="pb-10"></div>
                </>
            ):(
                <>
                <div className={styles.between}>
                    <div className="text-black font-bold">Hasil untuk &quot;{query}&quot;</div>
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
                            <option value="Rating Terendah">Rating Terendah</option>
                        </select>
                    </div>
                </div>
                <div className={styles.cardContainer}>
                    {sortedCourses.map((item) => (
                        <CourseCard key={item.title} course={item}/>
                    ))}
                </div>
                <div className="pb-10"></div>
                </>
            )
        }

        
      
    </div>
  );
}
