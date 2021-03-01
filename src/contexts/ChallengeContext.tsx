import Cookies from 'js-cookie';
import axios from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { LevelUpModal } from "../components/LevelUpModal";
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

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

interface ChallengeContextData {
    level: number,
    currentExp: number,
    challengesCompleted: number,
    expToNextLevel: number,
    activeChallenge: Challenge,
    totalExp: number,
    user: User,
    levelUp: () => void,
    startNewChallenge: () => void,
    resetChallenge: () => void,
    completeChallenge: () => void,
    closeLevelUpModal: () => void,
}

interface ChallengesProviderProps {
    children: ReactNode
    user: User
}

export const ChallengeContext = createContext({} as ChallengeContextData)

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
    const [user, setUser] = useState(rest.user ?? null);
    const [level, setLevel] = useState(rest.user.level ?? 1);
    const [totalExp, setTotalExp] = useState(rest.user.totalExp ?? 0);
    const [currentExp, setCUrrentExp] = useState(rest.user.currentExp ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.user.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const expToNextLevel = Math.pow((level + 1) * 4, 2)
    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        const updateUser = {
            ...user,
            level,
            currentExp,
            challengesCompleted,
            totalExp
        }
        Cookies.set('loggedUser', JSON.stringify(updateUser));
        axios.post('/api/updateUser', { updateUser })
    }, [level, currentExp, challengesCompleted, totalExp]);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }
    function startNewChallenge() {
        const randomchallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomchallengeIndex];
        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount} xp`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) return;
        const { amount } = activeChallenge;

        let finalExp = currentExp + amount;

        if (finalExp >= expToNextLevel) {
            finalExp = finalExp - expToNextLevel;
            levelUp();
        }
        setTotalExp(totalExp + amount)
        setCUrrentExp(finalExp);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    return (
        <ChallengeContext.Provider
            value={{
                level,
                currentExp,
                challengesCompleted,
                activeChallenge,
                expToNextLevel,
                totalExp,
                user,
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal,
            }}
        >
            {children}

            {
                isLevelUpModalOpen && <LevelUpModal />
            }
        </ChallengeContext.Provider>
    )
}


