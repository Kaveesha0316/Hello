import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { useFonts } from "expo-font";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";
import { router } from "expo-router";

 export default function signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonAnim] = useState(new Animated.Value(1));

  const [getfname, setfname] = useState("");
  const [getlname, setlname] = useState("");
  const [getmobile, setmobile] = useState("");
  const [getpassword, setpassword] = useState("");

  const [loaded, error] = useFonts({
    "PlaywriteDEGrund-VariableFont_wght": require("../assets/fonts/PlaywriteDEGrund-VariableFont_wght.ttf"),
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); 
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const logoPath = require("../assets/images/logo2.png");
  return (
    <LinearGradient colors={["#FFFFFF", "#d6d4d4"]} style={styles.container}>
      <AlertNotificationRoot>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
          <Animatable.View
            animation="fadeInDown"
            duration={1500}
            style={styles.logoContainer}
          >
            <Image source={logoPath} style={styles.logo} />
          </Animatable.View>

          <Animatable.View
            animation="fadeInDown"
            delay={500}
            duration={1500}
            style={styles.headerContainer}
          >
            <Text style={styles.appName}>Hello Chat</Text>
            <Text style={styles.welcomeMessage}>
              Welcome! Let's get started.
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={styles.formContainer}
          >
            
            <View style={styles.inputContainer}>
              <Icon
                name="user"
                size={20}
                color="#11111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#11111"
                style={styles.input}
                onChangeText={(text) => {
                  setfname(text);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="user"
                size={20}
                color="#11111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#11111"
                style={styles.input}
                onChangeText={(text) => {
                  setlname(text);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="phone"
                size={20}
                color="#11111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Mobile"
                placeholderTextColor="#11111"
                keyboardType="phone-pad"
                style={styles.input}
                maxLength={10}
                onChangeText={(text) => {
                  setmobile(text);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={20}
                color="#11111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#11111"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                maxLength={15}
                onChangeText={(text) => {
                  setpassword(text);
                }}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.icon}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#11111"
                />
              </TouchableOpacity>
            </View>

           
            <Animated.View
              style={[
                styles.buttonContainer,
                { transform: [{ scale: buttonAnim }] },
              ]}
            >
              <TouchableOpacity
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                style={styles.button}
                onPress={async () => {
                  let formdata = new FormData();
                  formdata.append("firstName", getfname);
                  formdata.append("lastName", getlname);
                  formdata.append("mobile", getmobile);
                  formdata.append("password", getpassword);

                  let response = await fetch(
                    process.env.EXPO_PUBLIC_URL+"/hello/SignUp",
                    {
                      method: "POST",
                      body: formdata,
                    }
                  );
                  if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                     

                      try{
                        Dialog.show({
                          type: ALERT_TYPE.SUCCESS,
                          title: "Success",
                          textBody: json.message,
                          button: "close",
                        });
                        await AsyncStorage.setItem("mobile", getmobile);
                        router.push("/selectprofileimage");
                      }catch(e){
                        Alert.alert("Error1");
                      }
                    

                    } else {
                      Dialog.show({
                        type: ALERT_TYPE.WARNING,
                        title: "Warning",
                        textBody: json.message,
                        button: "close",
                      });
                    }
                  }
                }}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text onPress={async () => {
              router.push("/signin");
            }} style={styles.footerLink}>Log In</Text>
            </Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  appName: {
    fontSize: 44,
    color: "#0f913f",
    fontFamily: "SofadiOne-Regular",
  },
  welcomeMessage: {
    fontSize: 18,
    color: "#11111",
    marginTop: 5,
    fontFamily: "Lato-Regular",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#11111",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
   
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#11111",
    fontSize: 16,
    fontFamily: "Lato-Regular",
  },
  inputFocused: {
    borderColor: "#FF512F",
  },
  icon: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#075E54",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    textTransform: "uppercase",
  },
  footerText: {
    color: "#11111",
    textAlign: "center",
    marginTop: 20,
  },
  footerLink: {
    fontWeight: "bold",
    color: "#11111",
    fontFamily: "Lato-Regular",
  },
});
