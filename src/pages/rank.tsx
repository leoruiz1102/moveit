import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { SideBar } from "../components/SideBar";
import { ChallengesProvider } from '../contexts/ChallengeContext';

import styles from '../styles/pages/Rank.module.css';

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

interface RankProps {
    user: User
}


export default function Rank(props: RankProps) {
    const [users, setUsers] = useState([] as User[]);

    async function loadUsers() {
        const { data } = await axios.get<User[]>('/api/allUsers');
        setUsers(data);
    }

    useEffect(() => {
        loadUsers();
    }, [])

    return (
        <div className="container">
            <Head>
                <title>Rank | Move.it</title>
            </Head>

            <SideBar />
            <ChallengesProvider user={props.user}>
                <div className={styles.rankContainer}>
                    <strong>Leaderboard</strong>

                    <header>
                        <span>POSIÇÃO</span>
                        <span>USUÁRIO</span>
                        <span>DESAFIOS</span>
                        <span>EXPERIÊNCIA</span>
                    </header>

                    {
                        !!users.length
                            ? (users.map((user, index) => {
                                return <Card key={user._id} user={user} position={index + 1} />
                            }))
                            : (
                                <>
                                    <div className={styles.fakeCard} />
                                    <div className={styles.fakeCard} />
                                    <div className={styles.fakeCard} />
                                </>
                            )
                    }
                </div>
            </ChallengesProvider>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { loggedUser } = ctx.req.cookies;
    const sendRedirectLocation = (location) => {
        ctx.res?.writeHead(302, {
            Location: location,
        });
        ctx.res?.end();
        return { props: {} }; // stop execution
    };

    if (!loggedUser) {
        sendRedirectLocation('/')
    }

    return {
        props: {
            user: JSON.parse(loggedUser),
        }
    }
}