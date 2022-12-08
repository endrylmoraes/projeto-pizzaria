import { useState, FormEvent, useContext } from "react";

import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";

import logoImg from "../../../public/logo.svg";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { AuthContext } from "../../contexts/AuthContext";

import { toast } from "react-toastify";

import Link from "next/link";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event){
    const { name, value } = event.target;
    
    setUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    
    if (user.name === "" || user.email === "" || user.password === "") {
      toast.warn("Você deve preencher todos os campos!");
      return;
    }

    setLoading(true);

    await signUp(user);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Pizzaria" />

        <div className={styles.login}>
            <h1>Criando sua conta</h1>

          <form onSubmit={handleSignUp}>
            <Input 
              placeholder="Digite seu nome"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />

            <Input 
              placeholder="Digite seu email"
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
            />

            <Input 
              placeholder="Digite sua senha"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>
          
          <Link href="/" legacyBehavior>
            <a className={styles.text}>
              Já possui uma conta? Faça Login!
            </a>
          </Link>

        </div>
      </div>
    </>
  )
}
