
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useFonts } from "expo-font";
import { Entypo, FontAwesome } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

 export default function index() {
  const [loaded, error] = useFonts({
    "PlaywriteDEGrund-VariableFont_wght": require("../assets/fonts/PlaywriteDEGrund-VariableFont_wght.ttf"),
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

   useEffect(() => {
    async function checkUser() {
     
      try {
        let userjson = await AsyncStorage.getItem("user");
        if (userjson != null) {
          router.replace("/home");
        }
      } catch (e) {
        console.log(e);
      }
    }
    checkUser();
  });

  useEffect(() => {                                                 
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const logoPath = require("../assets/images/logo2.png");

  return (
    <LinearGradient colors={["#FFFFFF", "#d6d4d4"]} style={styles.container}>
    
      <View style={styles.circleBackground}>
        <Animatable.View animation="fadeIn" duration={2000} style={styles.circle} />
        <Animatable.View animation="fadeIn" duration={2000} delay={500} style={styles.circle} />
      </View>

      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.logoContainer}
      >
        <Image source={logoPath} style={styles.logo} />
      </Animatable.View>
      <Animatable.View animation="fadeInUp" delay={500} style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Hello Chat!</Text>
        <Text style={styles.descriptionText}>
          We're glad to have you here. Start chatting with your friends!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={()=>{ 
            router.push("/signin")
          }} style={[styles.button, { backgroundColor: "#075E54" }]}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{ 
            router.push("/signup")
          }} style={[styles.button, { backgroundColor: "#075E54" }]}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

     
        <View style={styles.iconContainer}>
          <Entypo name="chat" size={50} color="#075E54" style={styles.icon} />
          <FontAwesome name="users" size={50} color="#075E54" style={styles.icon} />
        </View>

     
        <Text style={styles.infoText}>
          Explore new features and connect with others!
        </Text>
        
     
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {" "}© 2024 Hello Chat. All Rights Reserved.
          </Text>
          <Text style={styles.footerText}>
            Privacy Policy | Terms of Service
          </Text>

        
          <View style={styles.socialMediaContainer}>
            <TouchableOpacity>
              <FontAwesome name="facebook" size={30} color="#1877F2" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="twitter" size={30} color="#1DA1F2" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="instagram" size={30} color="#C13584" style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "absolute",
    opacity: 0.5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    
  },
  content: {
    alignItems: "center",
    padding: 20,
    zIndex: 1,
  },
  welcomeText: {
    fontSize: 36,
    color: "#0f913f",
    fontFamily: "SofadiOne-Regular",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 18,
    color: "#11111",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Lato-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginVertical: 20,
  },
  icon: {
    marginHorizontal: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#11111",
    textAlign: "center",
    fontFamily: "Lato-Regular",
  },
  footerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#11111",
    textAlign: "center",
    fontFamily: "Lato-Regular",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});