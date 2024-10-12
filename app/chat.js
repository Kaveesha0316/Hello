import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { ImageBackground } from "react-native";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";

export default function Chat() {
  const items = useLocalSearchParams();
  const [getchatText, setchatText] = useState(null);
  const [getChatArry, setChatArray] = useState([]);

  // Load custom fonts
  const [fontsLoaded, fontsError] = useFonts({
    "PlaywriteDEGrund-VariableFont_wght": require("../assets/fonts/PlaywriteDEGrund-VariableFont_wght.ttf"),
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
    "Lato-Italic": require("../assets/fonts/Lato-Italic.ttf"),
  });


  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded, fontsError]);


  useEffect(() => {
    async function fetchChatArray() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);

        let response = await fetch(
          process.env.EXPO_PUBLIC_URL+"/hello/LoadChat?logged_user_id=" +
            user.id +
            "&other_user_id=" +
            items.other_user_id
        );

        if (response.ok) {
          let chatArray = await response.json();
          setChatArray(chatArray);
        } else {
          console.error("Failed to fetch chat data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching chat array:", error);
      }
    }

    fetchChatArray();
    const intervalId = setInterval(() => {
      fetchChatArray();
    }, 2000);
    return () => clearInterval(intervalId); 

  }, [items.other_user_id]);
  const logoPath = require("../assets/images/background.png");
  const morePath = require("../assets/images/more3.png");
  const callPath = require("../assets/images/call.png");
  const videoPath = require("../assets/images/video.png");
  return (

    <ImageBackground
      source={logoPath}
      style={styles.backgroundImage}
    >
      <AlertNotificationRoot>
      <View style={styles.view1}>
        <StatusBar hidden={true} />
        
        <View style={styles.view2}>
          <View style={styles.view3}>
            {items.avater_image_found == "true" ? (
              <Image
                style={styles.image1}
                source={
                  process.env.EXPO_PUBLIC_URL +
                  "/hello/AvatarImage/" +
                  items.other_user_mobile +
                  ".png"
                }
                contentFit="contain"
              />
              
            ) : (
              <Text style={styles.text1}>{items.other_user_avater_letters}</Text>
            )}
            {items.other_user_status == 1 ? (
              <View style={styles.status2}></View>
            ) : null}
          </View>
          <View style={styles.view4}>
            <Text style={styles.text2}>{items.other_user_name}</Text>
            <Text style={styles.text33}>
              {items.other_user_status == 1 ? "Active now" : "Not active"}
            </Text>
          </View>
          <View style={styles.view4_1}>
          <Image
                style={styles.image2}
                source={
                  videoPath
                }
                contentFit="contain"
              />
              <FontAwesome6
                      name={"phone"}
                      color={"white"}
                      size={20}
                      style={{marginTop:5,marginHorizontal:10,}}
                    />
              <Image
                style={styles.image2}
                source={
                  morePath
                }
                contentFit="contain"
              />
          </View>
        </View>

        <View style={styles.center_view}>
          <FlashList
            data={getChatArry}
            renderItem={({ item }) => (
              <TouchableOpacity  delayLongPress={1000} onLongPress={async()=>{
                try {

                const response = await fetch( process.env.EXPO_PUBLIC_URL+"/hello/DeleteMessage?id="+item.id+"&msg="+item.message+"&side="+item.side);

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    console.log(json.message);
                  } else {
                    console.log("eerroe")
                    
                  }
                }

                } catch (e) {
                  console.log("error");
                }
                

              }}  activeOpacity={0.6}>
                <View
                  style={item.side == "right" ? styles.view5_1 : styles.view5_2}
                >
                  <Text style={item.message == "You deleted this message"?styles.text3_1:styles.text3}>{item.message}</Text>
                </View>
                <View
                  style={item.side == "right" ? styles.view6_1 : styles.view6_2}
                >
                  <Text style={styles.text4}>{item.date_time}</Text>
                  {item.side == "right" ? (
                    <FontAwesome6
                      name={item.status == 1 ?"check-double":"check"}
                      color={"black"}
                      size={18}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            estimatedItemSize={200}
          />
        </View>

        <View style={styles.view7}>
          <TextInput
            value={getchatText}
            style={styles.input1}
            placeholder="Type a message"
            onChangeText={(text) => setchatText(text)}
          />
          <TouchableOpacity
            onPress={async () => {
              if (getchatText.length == 0) {
                Dialog.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: "message is required",
                  button: "close",
                });
              
              } else {
                try {
                  let userJson = await AsyncStorage.getItem("user");
                  let user = JSON.parse(userJson);
                  let response = await fetch(
                    process.env.EXPO_PUBLIC_URL+"/hello/SendChat?logged_user_id=" +
                      user.id +
                      "&other_user_id=" +
                      items.other_user_id +
                      "&message=" +
                      getchatText
                  );

                  if (response.ok) {
                    let json = await response.json();
                    if (json.success) {
                      console.log("Message sent");
                      setchatText("");
                    }
                  } else {
                    console.error(
                      "Failed to send message. Status:",
                      response.status
                    );
                  }
                } catch (error) {
                  console.error("Error sending message:", error);
                }
              }
            }}
            style={styles.presable1}
          >
           <Icon
                  name="paper-plane"
                  size={25}
                  color="#ffff"
                 
                />
          </TouchableOpacity>
        </View>
      </View>
      </AlertNotificationRoot>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  view2: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#005C4B",
  },
  view3: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderkColor: "red",
    borderWidth: 2,
  },
  image1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image2: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    
  },
  image3: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    
  },
  text1: {
    fontFamily: "Lato-Bold",
    fontSize: 28,
  },
  view4: {
    paddingHorizontal: 20,
    alignItems: "center",
    left: -5,
  },
  view4_1: {
    flex: 1,
    justifyContent:"center",
    flexDirection:"row",
    columnGap:10,
  },
  text2: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    color: "white",
  },
  text3_1: {
    fontFamily: "Lato-Italic",
    fontSize: 18,
    color: "gray",
    alignSelf: "flex-start",
  },
  text3: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
    color: "#333333",
    alignSelf: "flex-start",
  },
  text33: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    color: "#c7c5c5",
    alignSelf: "flex-start",
  },
  view5_1: {
    backgroundColor: "#25D366",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    borderTopStartRadius: 40,
    justifyContent: "center",
    alignSelf: "flex-end",
    rowGap: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E0E0E0",
   
  },
  view5_2: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    borderTopEndRadius: 40,
    justifyContent: "center",
    alignSelf: "flex-start",
    rowGap: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E0E0E0",
  },
  view6_1: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    marginHorizontal: 15,
    top: -6,
  },
  view6_2: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-start",
    marginHorizontal: 15,
    top: -6,
  },
  text4: {
    fontFamily: "Lato-Bold",
    fontSize: 13,
    marginTop:5,
  },
  view7: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
    marginHorizontal: 20,
  },
  input1: {
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: "solid",
    fontFamily: "Lato-Regular",
    flex: 1,
    paddingStart: 10,
    fontSize: 20,
    borderColor:"#B0B0B0"
   
  },
  presable1: {
    backgroundColor: "#075E54",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    bottom: 5,
  },
  center_view: {
    flex: 1,
    marginVertical: 10,
  },
  status2: {
    width: 15,
    height: 15,
    backgroundColor: "green",
    borderRadius: 10,
    position: "absolute",
    left: 42,
    top: 42,
  },
});
