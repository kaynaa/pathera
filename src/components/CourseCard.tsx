
import styles from "./CourseCard.module.css";

type courseContent = {
  title: string;
  organization: string;
  rating: number;
  skills: string;
  difficulty: string;
  duration: string;
  link: string;
}

export default function CourseCard({ course }: { course:courseContent }){
    return(
        <a
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.courseCard}
            >
            <div className={styles.courseImageWrapper}>
            <img
                className={styles.courseImage}
                src={`/courseImage/${course.title}.png`}
                alt={course.title}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith('.png')) {
                    target.src = `/courseImage/${course.title}.jpg`;
                    } else {
                    // If not found, fallback to blank
                    target.onerror = null; // prevent infinite loop
                    target.src = "";
                    target.alt = "";
                    target.style.display = 'none';
                    }
                }}
            />
            </div>
            <div className={styles.courseContent}>
                <h4 className={styles.courseTitle}>{course.title}</h4>
                <p className={styles.courseOrg}>{course.organization}</p>
                <div className={styles.courseDetails}>
                <span>⭐ {course.rating}</span>
                <span>{course.difficulty}</span>
                </div>
            </div>
        </a>
    );
}