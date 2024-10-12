import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useFonts } from "expo-font";
import { Ionicons } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
export default function selectprofileimage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [getmobile, setmobile] = useState(null);

  const [loaded, error] = useFonts({
    "PlaywriteDEGrund-VariableFont_wght": require("../assets/fonts/PlaywriteDEGrund-VariableFont_wght.ttf"),
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("mobile");
      if (value !== null) {
       
        setmobile(value);
      }
    } catch (e) {
      
    }
  };

  getData();

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

  const logoPath = require("../assets/images/logo2.png");
  return (
    <LinearGradient colors={["#FFFFFF", "#d6d4d4"]} style={styles.container}>
      <AlertNotificationRoot>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
          <Animatable.View animation="fadeInDown" style={styles.logoContainer}>
            <Image source={logoPath} style={styles.logo} />
          </Animatable.View>

         
          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={styles.headerContainer}
          >
            <Text style={styles.headerText}>Select Profile Image</Text>
            <Text style={styles.subHeaderText}>
              Add a profile image or skip this step.
            </Text>
          </Animatable.View>

        
          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={styles.imageContainer}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imageUploadButton}
            >
              {selectedImage ? (
                <Image source={selectedImage} style={styles.profileImage} />
              ) : (
                <Text style={styles.imageUploadText}>Upload Image</Text>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={async () => {
                let formdata = new FormData();

                formdata.append("mobile", getmobile);

                if (selectedImage != null) {
                  formdata.append("avaterImage", {
                    name: "avatar.png",
                    type: "image/png",
                    uri: selectedImage,
                  });
                } else {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: "Please select a Image",
                    button: "close",
                  });
                  return;
                }
                let respose = await fetch(
                  process.env.EXPO_PUBLIC_URL+"/hello/SaveProfileImage",
                  {
                    method: "POST",
                    body: formdata,
                  }
                );

                if (respose.ok) {
                  let json = await respose.json();
                  if (json.success) {
                    Dialog.show({
                      type: ALERT_TYPE.SUCCESS,
                      title: "Success",
                      textBody: json.message,
                      button: "close",
                    });
                    router.push("/signin");
                  } else {
                    Dialog.show({
                      type: ALERT_TYPE.DANGER,
                      title: "Error",
                      textBody: json.message,
                      button: "close",
                    });
                  }
                }
              }}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{
                router.push("/signin")
            }} style={styles.skipButton}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </AlertNotificationRoot>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 32,
    color: "#0f913f",
    fontFamily: "SofadiOne-Regular",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#11111",
    fontFamily: "Lato-Regular",
    marginTop: 10,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
    
  },
  imageUploadButton: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#11111",
    borderWidth: 2,
  },
  imageUploadText: {
    color: "#11111",
    fontSize: 18,
    fontFamily: "Lato-Regular",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "#11111",
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  proceedButton: {
    backgroundColor: "#075E54",
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  skipButton: {
    backgroundColor: "#075E54",
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
});
