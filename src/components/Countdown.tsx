import { useContext, useEffect, useState } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';
import { FaCheckCircle } from 'react-icons/fa';

import styles from '../styles/components/Countdown.module.css';


export function Countdown() {
    const {
        minutes,
        seconds,
        isActive,
        startCountdown,
        resetCountdown,
        hasFinished } = useContext(CountdownContext);


    const [minuteLeft, minuteRigth] = String(minutes).padStart(2, '0').split('')
    const [secondLeft, secondRigth] = String(seconds).padStart(2, '0').split('')

    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRigth}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRigth}</span>
                </div>
            </div>

            {
                hasFinished ?
                    (
                        <button
                            disabled
                            className={`${styles.startCountdownButton}`}
                        >
                            Ciclo encerrado
                            <FaCheckCircle size={16} color="#00e322" />
                        </button>
                    ) :
                    (
                        isActive
                            ? (<button
                                type="button"
                                className={`${styles.startCountdownButton} ${styles.startCountdownButtonActive}`}
                                onClick={resetCountdown}
                            >
                                Abandonar Ciclo
                            </button>)
                            : (<button
                                type="button"
                                className={styles.startCountdownButton}
                                onClick={startCountdown}
                            >
                                Iniciar ciclo
                            </button>)

                    )
            }

        </div>
    );
}