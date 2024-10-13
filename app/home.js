import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { registerRootComponent } from "expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";

export default function home() {
  const [getChatArry, setChatArray] = useState([]);
  const [getmobile, setmobile] = useState(null);
  const [getsearchtext, setsearchtext] = useState("");
  const [getfirstName, setFirstName] = useState("");
  const [getlastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [getPostDescription, setPostDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [getpostArray, setPostArray] = useState([]);
  // Font loading
  const [loaded, error] = useFonts({
    "PlaywriteDEGrund-VariableFont_wght": require("../assets/fonts/PlaywriteDEGrund-VariableFont_wght.ttf"),
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let userJson = await AsyncStorage.getItem("user");

        let user = JSON.parse(userJson);
        setmobile(user.mobile);
        setFirstName(user.first_name);
        setLastName(user.last_name);

        let response = await fetch(
          process.env.EXPO_PUBLIC_URL +
            "/hello/LoadHomeData?id=" +
            user.id +
            "&searchtext=" +
            getsearchtext
        );

        if (response.ok) {
          let json = await response.json();
          if (json.success) {
            let chatarry = json.jsonchatarray;
            setChatArray(chatarry);
          } else {
            Alert.alert("Error", "Failed to load data");
          }
        } else {
          Alert.alert("Error", "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 2000);
  }, [getsearchtext]);

  useEffect(() => {
    async function fetchPostdata() {
      try {
        const response = await fetch(
          process.env.EXPO_PUBLIC_URL + "/hello/LoadPost"
        );
        if (response.ok) {
          let json = await response.json();
          if (json.success) {
            setPostArray(json.jsonPostarray);
            //  console.log(json.jsonPostarray);
          } else {
            Alert.alert("Error", "Failed to load post data");
          }
        } else {
          Alert.alert("Error", "Failed to fetcth");
        }
      } catch (errr) {
        console.log(errr);
      }
    }
    fetchPostdata();
    // const intervalId = setInterval(() => {
    //   fetchPostdata();
    // }, 2000);
  }, []);

  const imgpath =
    process.env.EXPO_PUBLIC_URL + "/hello/AvatarImage/" + getmobile + ".png";

  const checkImageExists = async () => {
    try {
      const response = await fetch(imgpath+ `?timestamp=${new Date().getTime()}`);
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    checkImageExists().then((exists) => {
      if (exists) {
        setProfileImage(imgpath+ `?timestamp=${new Date().getTime()}`);
      }
    });
  }, [getmobile]);

  let nameletters = "";
  if (getfirstName && getlastName) {
    nameletters = getfirstName[0] + getlastName[0];
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn("Failed to hide splash screen:", err);
      });
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["#FFFFFF", "#d6d4d4"]} style={styles.view1}>
        <AlertNotificationRoot>
      <View style={styles.view2}>
        <Text style={styles.text1}>Hello Chat</Text>
        <TouchableOpacity
          onPress={async () => {
            router.push("/profile");
          }}
          style={styles.view3}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.img1_1} />
          ) : (
            <Text style={styles.profiletext_1}>{nameletters}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.status}></View>
      </View>
      <View style={styles.view2}>
        <View style={styles.inputContainer}>
          <Icon name="search" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#fff"
            style={styles.input}
            onChangeText={(text) => {
              setsearchtext(text);
            }}
          />
        </View>
      </View>
      <View style={styles.view2_1}>
        <Text style={styles.text1_1}>Chats</Text>
        <Text style={styles.text1_1}>Posts</Text>
      </View>
      <PagerView style={{ flex: 1 }} initialPage={0}>
        <View style={{ flex: 1 }}>
          <FlashList
            key="1"
            data={getChatArry}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: "/chat", params: item });
                }}
                style={styles.view5}
              >
                <View style={styles.view6}>
                  {item.avater_image_found ? (
                    <Image
                      source={
                        process.env.EXPO_PUBLIC_URL +
                        "/hello/AvatarImage/" +
                        item.other_user_mobile +
                        ".png"
                      }
                      style={styles.img1}
                      contentFit="contain"
                    />
                  ) : (
                    <Text style={styles.profiletext}>
                      {item.other_user_avater_letters}
                    </Text>
                  )}
                </View>
                {item.other_user_status == 1 ? (
                  <View style={styles.status2}></View>
                ) : null}

                <View style={styles.view4}>
                  <View style={styles.view7}>
                    {item.unseen_message_count != 0 ? (
                      <View style={styles.msgcount}>
                        <Text style={styles.text7}>
                          {item.unseen_message_count}
                        </Text>
                      </View>
                    ) : null}

                    <Text style={styles.text6}>{item.other_user_name}</Text>
                    {item.message != "Let's start start new chat" ? (
                      <Text
                        style={
                          item.unseen_message_count != 0
                            ? styles.text5_1
                            : styles.text5_2
                        }
                      >
                        {item.dateTime}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.view8}>
                    {(item.message != "Let's start start new chat") &
                    (item.tick_from == true) ? (
                      <FontAwesome6
                        name={
                          item.chat_status_id == 1 ? "check-double" : "check"
                        }
                        color={"black"}
                        size={20}
                      />
                    ) : null}

                    <Text style={styles.text4} numberOfLines={1}>
                      {item.message}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            estimatedItemSize={200}
          />
        </View>
        <View style={styles.page} key="2">
        
          <View style={styles.uploaderContainer}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imageUploadButton}
            >
              <Icon name="image" size={20} color="#fff" />
            </TouchableOpacity>
            <TextInput
              placeholder="What's on your mind?"
              placeholderTextColor="#888"
              style={styles.textInput}
              multiline
              value={getPostDescription}
              numberOfLines={4}
              onChangeText={(text) => setPostDescription(text)}
            />
          </View>

        
          <TouchableOpacity
            onPress={async () => {
              try {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                if (!selectedImage) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: "Image is required",
                    button: "close",
                  });
                  return;
                }

                if (getPostDescription == "") {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: "Description is required",
                    button: "close",
                  });
                  return;
                }

                let formdata = new FormData();

                formdata.append("desc", getPostDescription);
                formdata.append("user_id", user.id);
                formdata.append("postImage", {
                  name: "avatar.png",
                  type: "image/png",
                  uri: selectedImage,
                });

                const response = await fetch(
                  process.env.EXPO_PUBLIC_URL + "/hello/SavePost",
                  {
                    method: "POST",
                    body: formdata,
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    Dialog.show({
                      type: ALERT_TYPE.SUCCESS,
                      title: "Success",
                      textBody: "success",
                      button: "close",
                    });
                    setPostDescription("");
                  } else {
                    Dialog.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: json.message,
                      button: "close",
                    });
                   
                  }
                } else {
                  Alert.alert("Error", "Failed to post");
                }
              } catch (error) {
                console.log(error);
              }
            }}
            style={styles.postButton}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>

          <View style={styles.postsContainer}>
            <FlashList
              data={getpostArray}
              renderItem={({ item }) => (
                <View style={styles.postItem}>
                  <View style={styles.profileContainer}>
                    <View style={styles.view6_1}>
                      {item.avater_image_found ? (
                        <Image
                          source={{
                            uri:
                              process.env.EXPO_PUBLIC_URL +
                              "/hello/AvatarImage/" +
                              item.mobile +
                              ".png",
                            cache: "reload", 
                          }}
                          style={styles.img2}
                        />
                      ) : (
                        <Text style={styles.profiletext2}>
                          {item.other_user_avater_letters}
                        </Text>
                      )}
                    </View>
                    {item.user_stutus == 1 ? (
                      <View style={styles.status3}></View>
                    ) : null}

                    <View style={styles.profileview}>
                      <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.date}>{item.date_time}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={async () => {
                          const response = await fetch(
                            process.env.EXPO_PUBLIC_URL +
                              "/hello/DeletePost?id=" +
                              item.id
                          );

                          if (response.ok) {
                            const json = await response.json();
                            if (json.success) {
                              Dialog.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: "success",
                                textBody: json.message,
                                button: "close",
                              });
                            
                            } else {
                              Dialog.show({
                                type: ALERT_TYPE.WARNING,
                                title: "Warning",
                                textBody: json.message,
                                button: "close",
                              });
                            
                            }
                          } else {
                            Alert.alert("Error", "fetch error");
                          }
                        }}
                      >
                        {getmobile == item.mobile ? (
                          <Icon
                            name="trash"
                            style={styles.trash}
                            size={20}
                            color="#11111"
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.postAbout}>{item.description}</Text>

                  <Image
                    source={{
                      uri:
                        process.env.EXPO_PUBLIC_URL +
                        "/hello/PostImages/" +
                        item.id +
                        ".png",
                      cache: "reload", 
                    }}
                    style={styles.postImage}
                  />
                </View>
              )}
              estimatedItemSize={200}
            />
          </View>
        </View>
      </PagerView>
      </AlertNotificationRoot>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
  },
  page: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  view2: {
    columnGap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    borderBlockColor: "rgba(255, 255, 255,)",
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#075E54",
    paddingTop: 10,
  },
  view2_1: {
    columnGap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    borderBlockColor: "rgba(255, 255, 255,)",
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 50,
    backgroundColor: "#075E54",
  },
  view3: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  view4: {
    flex: 1,
    justifyContent: "center",
    rowGap: 7,
  },
  view5: {
    flexDirection: "row",
    marginVertical: 0,
    columnGap: 10,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  view6: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
  },
  view6_1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
    marginVertical: 10,
  },

  view7: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  view8: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },

  text1: {
    fontFamily: "SofadiOne-Regular",
    fontSize: 32,
    color: "#fff",
    marginLeft:10,
  },

  text1_1: {
    fontFamily: "Lato-Regular",
    fontSize: 20,
    color: "#fff",
    marginVertical: 5,
  },

  text2: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
    color: "#fff",
  },
  text3: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
    alignSelf: "flex-end",
    color: "#fff",
  },
  text4: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
  },
  text5_1: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    alignSelf: "flex-end",
    color: "#25D366",
  },
  text5_2: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    alignSelf: "flex-end",
  },
  text6: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    alignSelf: "flex-start",
  },
  text7: {
    fontFamily: "Lato-Bold",
    fontSize: 15,
    alignSelf: "center",
    color: "white",
  },
  scrollview: {
    marginLeft: -10,
    marginRight: -10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato-Regular",
  },
  status: {
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 5,
    position: "absolute",
    top: 40,
    right: 15,
  },
  status2: {
    width: 15,
    height: 15,
    backgroundColor: "green",
    borderRadius: 10,
    position: "absolute",
    left: 50,
    top: 46,
  },
  status3: {
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 5,
    position: "absolute",
    top: 38,
    right: 275,
  },
  msgcount: {
    width: 25,
    height: 25,
    backgroundColor: "#25D366",
    borderRadius: 15,
    position: "absolute",
    left: 275,
    top: 25,
    justifyContent: "center",
  },
  profiletext: {
    fontFamily: "Lato-Bold",
    fontSize: 30,
    color: "#111111",
    alignSelf: "center",
    marginTop: 10,
  },
  profiletext_1: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    color: "#111111",
    alignSelf: "center",
    marginTop: 6,
  },
  profiletext2: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    color: "#111111",
    alignSelf: "center",
    marginTop: 5,
  },
  img1: {
    width: 60,
    height: 60,
    borderRadius: 40,
    alignSelf: "center",
    justifyContent: "center",
    top: -2,
  },
  img1_1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "center",
    justifyContent: "center",
    top: -2,
  },
  img2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "center",
    justifyContent: "center",
    top: -2,
  },
  uploaderContainer: {
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    columnGap: 12,
    justifyContent: "center",
  },
  imageUploadButton: {
    backgroundColor: "#075E54",
    justifyContent: "center",
    borderRadius: 25,
    alignItems: "center",
    width: 50,
    height: 50,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  textInput: {
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    height: 40,
    textAlignVertical: "top",
    fontFamily: "Lato-Regular",
    width: "80%",
  },
  postButton: {
    backgroundColor: "#075E54",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
  postsContainer: {
    flex: 1,
  },
  postItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
  date: {
    fontSize: 14,
    fontFamily: "Lato-Regular",
  },
  postAbout: {
    fontSize: 17,
    color: "#555",
    fontFamily: "Lato-Regular",
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  trash: {
    alignSelf: "flex-end",
  },
  profileview: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
    width: "85%",
  },
});
