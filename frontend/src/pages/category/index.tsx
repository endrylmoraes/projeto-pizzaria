import { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";

import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { toast } from "react-toastify";


export default function Category(){
  const [name, setName] = useState("");

  async function handleRegister(e: FormEvent){
    e.preventDefault();

    if(name === ""){
      toast.warn("É necessário informar um nome para a categoria!")
      return;
    }

    const apiClient = setupAPIClient();
    await apiClient.post("/category", {
      name:name
    });

    toast.success("Categoria cadastrada com sucesso!");
    setName("");
  }

  return(
    <>
    <Head>
      <title>Nova categoria - ToPizza</title>
    </Head>
    <div>
      <Header />
      <main className={styles.container}>
        <h1>Nova Categoria</h1>
        <form className={styles.form} onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Digite o nome para a categoria" 
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <button type="submit">
            Cadastrar
          </button>
        </form>
      </main>
    </div>
    </>
  )
} 

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return{
      props:{}
  }
});