import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";
import { useFonts } from "expo-font";
import { Image } from "react-native"; 
import { registerRootComponent } from "expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { router } from "expo-router";

export default function profile() {
  
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [getMobile, setMobile] = useState("");
  const [userData, setUserData] = useState(null);
  const [loaded, error] = useFonts({
    "PlaywriteDEGrund-VariableFont_wght": require("../assets/fonts/PlaywriteDEGrund-VariableFont_wght.ttf"),
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn("Failed to hide splash screen:", err);
      });
    }
  }, [loaded, error]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      Alert.alert("Error reading value");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getData();
      if (data) {
        setUserData(data);
        setFirstName(data.first_name); // Set the first name directly
        setLastName(data.last_name);
        setMobile(data.mobile);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const imgpath =
  process.env.EXPO_PUBLIC_URL+"/hello/AvatarImage/" +
    getMobile +
    ".png";

  const checkImageExists = async () => {
    try {
      const response = await fetch(
        imgpath + `?timestamp=${new Date().getTime()}`
      );
      
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
   
        setProfileImage(imgpath + `?timestamp=${new Date().getTime()}`);
      } else {
     
      }
    });
  }, [getMobile]); 

  let nameletters = "";
  if (userData && userData.first_name && userData.last_name) {
    nameletters = userData.first_name[0] + userData.last_name[0];
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient  colors={["#FFFFFF", "#d6d4d4"]} style={styles.container}>
      <AlertNotificationRoot>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
          <Text style={styles.updatetext}>Update your profile</Text>

          <Animatable.View
            animation="fadeInDown"
            duration={1500}
            style={styles.imageContainer}
          >
            <TouchableOpacity onPress={pickImage}>
             
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.addImageText}>
                  <Text style={{ fontSize: 80, color: "white" }}>
                    {nameletters}
                  </Text>
                </View>
              )}

              <View style={styles.cameraIconContainer}>
                <Icon name="camera" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animatable.View>
          <Text style={styles.updatetext}>{getMobile}</Text>
         
          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={styles.formContainer}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#fff"
                style={styles.input}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#fff"
                style={styles.input}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>

        
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                let formdata = new FormData();
                formdata.append("mobile", getMobile);
                formdata.append("firstName", firstName);
                formdata.append("lastName", lastName);
                formdata.append("avaterImage", {
                  uri: profileImage,
                  name: "avatar.png",
                  type: "image/png",
                });

                const response = await fetch(
                  process.env.EXPO_PUBLIC_URL+"/hello/ProfileUpdate",
                  {
                    method: "POST",
                    body: formdata,
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    let user = json.user;

                    try {
                      await AsyncStorage.setItem("user", JSON.stringify(user));
                      Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: json.message,
                        button: "close",
                      });
                     
                     
                    } catch (e) {
                      Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: json.message,
                        button: "close",
                      });
                    }
                    router.replace("/profile");
                  } else {
                    Dialog.show({
                      type: ALERT_TYPE.DANGER,
                      title: "Error",
                      textBody: json.message,
                      button: "close",
                    });
                  }
                } else {
                  Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: "error",
                    button: "close",
                  });
                }
              }}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </AlertNotificationRoot>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#005C4B",
    borderRadius: 20,
    padding: 5,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
    borderColor: "#111111",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#111111",
    fontSize: 16,
    fontFamily: "Lato-Regular",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#005C4B",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
  updatetext: {
    fontFamily: "Lato-Bold",
    fontSize: 24,
    color: "#111111" ,
    marginBottom: 20,
    textAlign: "center",
  },
  addImageText: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#005C4B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});
