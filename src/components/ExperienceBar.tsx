import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/ExperienceBar.module.css';

export function ExperienceBar() {
	const { currentExp, expToNextLevel } = useContext(ChallengeContext);

	const percentToNextLevel = Math.round(currentExp * 100) / expToNextLevel;

	return (
		<>
			<header className={styles.experienceBar}>
				<span>0 xp</span>
				<div>
					<div style={{ width: `${percentToNextLevel}%` }}></div>
					<span className={styles.currentExp} style={{ left: `${percentToNextLevel}%` }}>
						{currentExp} xp
					</span>
				</div>
				<span>{expToNextLevel} xp</span>
			</header>
		</>
	);
}