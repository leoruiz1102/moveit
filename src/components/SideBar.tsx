import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'
import { FaHome, FaMedal, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';


import styles from '../styles/components/SideBar.module.css';

export function SideBar() {
    const router = useRouter();
    const pathName = router.pathname.substr(1)

    function handleSignOut() {
        Cookies.remove('loggedUser')
        router.push('/')
    }

    return (
        <div className={styles.container}>
            <img src="/icons/logo.svg" alt="Logo" />

            <div className={styles.optionsContainer}>
                <button
                    className={pathName === 'home' ? styles.optionActive : ''}
                    onClick={() => router.push('/home')}>
                    <FaHome size={32} />
                </button>
                <button
                    className={pathName === 'rank' ? styles.optionActive : ''}
                    onClick={() => router.push('/rank')}>
                    <FaMedal size={32} />
                </button>
            </div>

            <footer>
                <button
                    onClick={handleSignOut}>
                    <FaSignOutAlt size={32} />
                </button>
            </footer>
        </div>
    );
}