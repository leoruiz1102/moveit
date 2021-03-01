import { ReactNode, useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/Card.module.css';

interface User {
    _id: string
    name: string
    username: string,
    githubAvatar: string,
    level: number,
    currentExp: number,
    challengesCompleted: number,
    totalExp: number
}

interface CardProps {
    children?: ReactNode,
    user: User,
    position: number,
}

export function Card({ children, user, position }: CardProps) {
    const { level, currentExp } = useContext(ChallengeContext);

    return (
        <div className={styles.cardContainer}>
            <div className={styles.position}>
                <strong>{position}</strong>
            </div>

            <div className={styles.user}>
                <img src={user.githubAvatar} alt="Avatar" />
                <div>
                    <strong>{user.name}</strong>
                    <p>
                        <img src="/icons/arrow-up.svg" alt="Up" />
                        {user.level}
                    </p>
                </div>
            </div>

            <p><span>{user.challengesCompleted}</span> completos</p>
            <p><span>{user.totalExp}</span> xp</p>
        </div>
    );
}