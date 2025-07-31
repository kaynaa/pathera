
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
        // <div>{course.title}</div>
        <a
            href={course.link}
            // key={index}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.courseCard}
            >
            <div className={styles.courseImage}>
                
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