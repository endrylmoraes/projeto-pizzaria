import { useState, ChangeEvent, FormEvent } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";

import Head from "next/head";
import Image from "next/image";
import styles from "./styles.module.scss";
import { FiUpload } from "react-icons/fi";
import { NOMEM } from "dns";

type ItemProps = {
  id: string;
  name: string;
}

interface CategoryProps{
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList ||  []);
  const [categorySelected, setCategorySelected] = useState(0);
  
  function handleFile(e: ChangeEvent<HTMLInputElement>){
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if(!image){
      return;
    }

    if(image.type === "image/jpeg" || image.type === "image/png"){
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(image));
    }
  }

  function handleChangeCategory(e){
    setCategorySelected(e.target.value);
  }


  async function handleRegister(e: FormEvent){
    e.preventDefault();
    try {
      if (name === "" || price === "" || description === "" || imageAvatar === null) {
        toast.error("Todos os campos devem ser preenchidos!");
        return;
      }

      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("file", imageAvatar);
      data.append("category_id", categories[categorySelected].id); // array - index selecionado

      const apiClient = setupAPIClient();

      await apiClient.post("/product", data);

      toast.success("Produto cadastrado com sucesso!");

      setName("");
      setPrice("");
      setDescription("");
      setAvatarUrl("");
      setImageAvatar(null);
      setCategorySelected(0);
      
    } catch (err) {
      console.log(err);
      toast.error("Erro ao cadastrar");
    }
  }
  


  return(
    <>
      <Head>
        <title>Cadastrar Produto - ToPizza</title>
      </Head>

      <div>
        <Header/>
        
        <main className={styles.container}>
          <h1>Cadastrar Produto</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={25} color="#FFF" />
              </span>
              
              <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>

              {avatarUrl && (
                <Image 
                  src={avatarUrl}
                  alt="Foto do produto"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <select value={categorySelected} onChange={handleChangeCategory}>
              {
                categories.map((item, index)=>{
                  return(
                    <option key={item.id} value={index}>
                      {item.name}
                    </option>
                  )
                })
              }
            </select>

            <input
              type="text"
              placeholder="Digite o nome do produto"
              className={styles.input}
              value={name}
              onChange={ e => setName(e.target.value) }
            />

            <input
              type="text"
              placeholder="Digite o preço do produto"
              className={styles.input}
              value={price}
              onChange={ e => setPrice(e.target.value) }
            />

            <textarea 
              placeholder="Descreva o produto"
              className={styles.input}
              value={description}
              onChange={ e => setDescription(e.target.value) }
            />

            <button type="submit">Cadastrar</button>
          </form>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/category");
  // console.log(response.data);
  
  return{
      props:{
        categoryList: response.data
      }
  }
});