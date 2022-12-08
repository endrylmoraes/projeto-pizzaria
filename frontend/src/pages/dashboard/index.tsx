import { useState } from "react";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { FiRefreshCcw } from "react-icons/fi";

import Modal from "react-modal";
import { ModalOrder } from "../../components/ModalOrder";

import { setupAPIClient } from "../../services/api";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

type OrderProps = {
  id: string;
  table: number | string;
  status: boolean;
  draft: boolean;
  name: string | null;
}

interface HomeProps{
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product:{
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  }
  order:{
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}

export default function Dashboard({ orders }: HomeProps){

  const [ordersList, setOrdersList] = useState(orders || []);

  const [modalItems, setModalItems] = useState<OrderItemProps[]>();
  const [modalVisible, setModalVisible] = useState(false);

  async function handleOpenModal(id: string){
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/details", {
      params: {
        order_id: id
      }
    })

    setModalItems(response.data);
    setModalVisible(true);
  }

  async function handleRefreshOrders(){
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/orders");

    setOrdersList(response.data);
  }

  function handleCloseModal(){
    setModalVisible(false);
  }

  async function handleFinishOrder(id: string) {
    const apiClient = setupAPIClient();

    // update no status da order para true (concluída)
    const response = await apiClient.put("/order/finish", {
      order_id: id,
    });
    
    // atualiza a lista de pedidos
    // const resp = await apiClient.get("/orders");
    // setOrdersList(resp.data);
    await handleRefreshOrders();

    // fecha o modal
    setModalVisible(false);

    toast.success(`A mesa ${response.data.table} foi fechada!`);
  }

  Modal.setAppElement("#__next");

  return(
    <>
    <Head>
        <title>Painel - ToPizza</title>
    </Head>
    
    <div>
      <Header />
      
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <h1>Últimos pedidos</h1>
          <button onClick={handleRefreshOrders}>
            <FiRefreshCcw size={25} color="#3fffa3" />
          </button>
        </div>

        <article className={styles.listOrders}>
          {
            ordersList.length === 0 && (
              <span className={styles.emptyList}>Nenhum pedido em aberto...</span>
            )
          }
          {
            ordersList.map( order => (
                <section key={order.id} className={styles.orderItem}>
                  <button onClick={ () => {handleOpenModal(order.id)} }>
                    <div className={styles.tag}></div>
                    <span>
                      Mesa {order.table} 
                      {order.name && ( ` - ( ${order.name} )` )}
                    </span>
                  </button>
                </section>
              )
            )
          }
        </article>

      </main>

      {
        modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            orderItems={modalItems}
            handleFinishOrder={handleFinishOrder}
          />
        )
      }

    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/orders");

  //console.log(response.data);
  
  return{
      props:{
        orders: response.data
      }
  }
});