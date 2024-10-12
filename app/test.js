import AsyncStorage from "@react-native-async-storage/async-storage"

async()=>{
 const user = {
    name:"kamal",
    mobile:"0748555"
 }

 await AsyncStorage.setItem("user",JSON.stringify(user));
}