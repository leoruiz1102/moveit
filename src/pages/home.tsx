import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { CompletedChallenges } from '../components/CompletedChallenges';
import { CountdownProvider } from '../contexts/CountdownContext';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from '../components/ExperienceBar'
import { Profile } from '../components/Perfil'
import { ChallengeBox } from '../components/ChallengeBox';

import styles from '../styles/pages/Home.module.css';
import { ChallengesProvider } from '../contexts/ChallengeContext';
import { SideBar } from '../components/SideBar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
    _id: string,
    name: string
    username: string,
    githubAvatar: string,
    level: number,
    currentExp: number,
    challengesCompleted: number,
    totalExp: number
}

interface HomeProps {
    user: User
}

export default function Home(props: HomeProps) {
    const router = useRouter();

    useEffect(() => {
        if (!props.user) router.push('/login')
    }, [])

    return (
        <div className="container">
            <SideBar />
            <ChallengesProvider user={props.user}>
                <div className={styles.container}>
                    <Head>
                        <title>Inicio | Move.it</title>
                    </Head>
                    <ExperienceBar />

                    <CountdownProvider>
                        <section>
                            <div>
                                <Profile />
                                <CompletedChallenges />
                                <Countdown />
                            </div>
                            <div>
                                <ChallengeBox />
                            </div>
                        </section>
                    </CountdownProvider>
                </div>
            </ChallengesProvider>
        </div>
    )
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