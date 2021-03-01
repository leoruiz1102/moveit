import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const { level, user } = useContext(ChallengeContext);

    return (
        <div className={styles.profileContainer}>
            <img src={user.githubAvatar} alt="Leo Ruiz" />
            <div>
                <strong>{user.name}</strong>
                <p>
                    <img src="icons/level.svg" alt="Level" />
                    Level {level}</p>
            </div>
        </div>
    );
}