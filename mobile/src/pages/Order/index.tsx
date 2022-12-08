import { useState, useEffect } from "react";

import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList
} from "react-native";

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

import { Feather } from "@expo/vector-icons";

import { api } from "../../services/api";

import { ModalPicker } from "../../components/ModalPicker";

import { ListItem } from "../../components/ListItem";
//import Routes from "../../routes";

type RouteDetailParams = {
  Order:{
    table: number | string;
    order_id: string;
  }
}

export type CategoryProps = {
  id: string;
  name: string;
}

type ProductProps = {
  id: string;
  name: string;
}

export type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
}

type OrderRouteProps = RouteProp<RouteDetailParams, "Order">;

export default function Order(){
  const route = useRoute<OrderRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [categories, setCategories] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

  const [products, setProducts] = useState<ProductProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
  const [modalProductVisible, setModalProductVisible] = useState(false);

  const [amount, setAmount] = useState("1");
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(()=>{
    async function loadCategories(){
      const response = await api.get("/category");

      setCategories(response.data);
      setCategorySelected(response.data[0]);
    }

    loadCategories();
    
  },[]);

  useEffect(() => {
    //atualizar produtos de acordo com a nova categoria...
    async function loadProducts(){
      const response = await api.get("/category/products",{
        params:{
          category_id: categorySelected?.id
        }
      });

      setProducts(response.data);
      setProductSelected(response.data[0]);
    }

    loadProducts();

  },[categorySelected]);

  async function handleCloseOrder(){
    try {
      await api.delete("/order", {
        params:{
          order_id: route.params?.order_id
        }
      });

      navigation.goBack();

    } catch (err) {
      console.log(err);
    }
  }

  function handleChangeCategory(item: CategoryProps){
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps){
    setProductSelected(item);
  }

  function handleFinishOrder(){
    navigation.navigate("FinishOrder", {
      table: route.params?.table,
      order_id: route.params?.order_id
    });
  }

  async function handleAddItem(){
    const response = await api.post("/order/add", {
      order_id: route.params?.order_id,
      product_id: productSelected?.id,
      amount: Number(amount)
    });

    const data = {
      id: response.data.id,
      product_id: productSelected?.id as string,
      name: productSelected?.name as string,
      amount: amount
    }
    
    setItems(oldArray => [...oldArray, data]);

    setAmount("1");
  }

  async function handleDeleteItem(item_id: string) {
    const response = await api.delete("/order/remove", {
      params:{
        item_id: item_id
      }
    });

    const newList = items.filter((item) => {
      return item_id !== item.id;
    });

    setItems(newList);
  }

  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mesa {route.params.table}
        </Text>

        {items.length === 0 && (
          <TouchableOpacity onPress={handleCloseOrder}>
            <Feather name="trash-2" size={28} color="#ff3f4b" />
          </TouchableOpacity>
        )}
        
      </View>

      { categories.length !==0 &&  (
        <TouchableOpacity style={styles.input} onPress={ () => setModalCategoryVisible(true) }>
          <Text style={{color: '#fff'}}>
            {categorySelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      { products.length !==0 &&  (
        <TouchableOpacity style={styles.input} onPress={ () => setModalProductVisible(true) }>
          <Text style={{color: '#fff'}}>
            {productSelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.containerAmount}>
        <Text style={styles.textAmount}>Quantidade</Text>
        <TextInput
          style={[styles.input , { width: '60%', textAlign: 'center' }]} 
          placeholderTextColor="#f0f0f0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAddItem}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={ ({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} /> }
      />

      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        animationType="fade"
      >
        <ModalPicker 
          handleCloseModal={ () => setModalCategoryVisible(false) }
          options={categories}
          selectedItem = { handleChangeCategory }
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalProductVisible}
        animationType="fade"
      >
        <ModalPicker 
          handleCloseModal={ () => setModalProductVisible(false) }
          options={products}
          selectedItem = { handleChangeProduct }
        />
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#1d1d2e',
    paddingVertical: '5%',
    paddingHorizontal: '4%',
  },
  header:{
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 12,
    alignItems: 'center'
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 14
  },
  input:{
    backgroundColor: '#101026',
    borderRadius: 4,
    width: '100%',
    height: 40,
    marginBottom: 12,
    justifyContent: 'center',
    paddingHorizontal: 8,
    color: '#fff',
    fontSize: 20
  },
  containerAmount:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  textAmount:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  actions:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  buttonAdd:{
    width: '20%',
    backgroundColor: '#3fd1ff',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText:{
    color: '#101026',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button:{
    backgroundColor: '#3fffa3',
    borderRadius: 4,
    height: 40,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});