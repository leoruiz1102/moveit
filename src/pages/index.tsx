import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { FaGithub, FaChevronRight, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { ChallengeContext } from '../contexts/ChallengeContext';
import Cookies from 'js-cookie';

import styles from '../styles/pages/Login.module.css';

export default function Login() {

  const [error, setError] = useState(false);
  const [username, setUsername] = useState('')
  const router = useRouter();
  async function handleLogin() {
    if (username) {
      try {
        const { data } = await axios.get(`https://api.github.com/users/${username}`)
        const user = {
          username: data.login,
          githubAvatar: data.avatar_url,
          name: data.name
        }
        const response = await axios.post('/api/users', { loggedUser: user });
        const { loggedUser } = response.data;
        Cookies.set('loggedUser', JSON.stringify(loggedUser));
        router.push('/home');
      } catch (err) {
        setError(true);
      }
    }
  }

  return (
    <div className={styles.container}>
      {
        error && (
          <div className={styles.errorBox}>
            <FaExclamationCircle color="#f74848" size={32} />
            <p>Ops... Usuário não encontrado!</p>
            <button onClick={() => { setError(false) }}>
              <FaTimes size={24} color="#666" />
            </button>
          </div>
        )
      }
      <div className={styles.simble}>
        <img src="/simbolo.svg" alt="simbolo" />
      </div>
      <div className={styles.login}>
        <section className={styles.loginSection}>
          <img src="/logo.png" alt="Logo" />

          <strong>Bem-vindo</strong>
          <div className={styles.description}>
            <FaGithub size={40} />
            <p>Faça login com seu Github para começar</p>
          </div>
          <div className={styles.loginForm}>
            <input type="text" placeholder="Digite seu username" onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleLogin} className={username ? styles.loginAble : ''}>
              <FaChevronRight size={32} color="#fff" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}