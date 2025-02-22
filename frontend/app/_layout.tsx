import { SplashScreen, Stack ,useRouter} from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext"; // Import LanguageProvider and useLanguage hook
import { TouchableOpacity, Text, View,ScrollView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import icons (can use other icon libraries as well)

export default function MainLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf") as string,
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf") as string,
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf") as string,
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf") as string,
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf") as string,
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf") as string,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* Language Switcher (Can be placed globally in the layout) */}
      {/* <LanguageSwitcher /> */}
    </LanguageProvider>
  );
}

// const LanguageSwitcher = () => {

//   const router= useRouter();
//   const { language, setLanguage } = useLanguage();
//   const [dropdownVisible, setDropdownVisible] = useState(false); // Track dropdown visibility

//   // Function to toggle between languages
//   const changeLanguage = (lang: "en" | "hi" | "mr") => {
//     setLanguage(lang);
//     setDropdownVisible(false); // Close the dropdown after selecting language
//   };

//   return (
//     <View className="absolute top-4 right-4 p-2 rounded-lg bg-gray-300">
//       <TouchableOpacity
//         onPress={() => {
//           // Navigate to the profile screen
//           router.push({
//             pathname: "/(root)/profile", 
//           });
//         }}
//         className="flex-row items-center"
//       >
//         <FontAwesome name="globe" size={20} color="black" />
//       </TouchableOpacity>

//       {/* Dropdown for language selection */}
//       {dropdownVisible && (
//         <View
//           className="absolute mt-2 right-0 top-10 p-2 w-40 bg-white rounded-lg shadow-lg"
//           style={{
//             borderWidth: 1,
//             borderColor: "#ccc",
//           }}
//         >
//           <Pressable onPress={() => changeLanguage("en")}>
//             <Text className="text-black p-2">Switch to English</Text>
//           </Pressable>
//           <Pressable onPress={() => changeLanguage("hi")}>
//             <Text className="text-black p-2">Switch to Hindi</Text>
//           </Pressable>
//           <Pressable onPress={() => changeLanguage("mr")}>
//             <Text className="text-black p-2">Switch to Marathi</Text>
//           </Pressable>
//         </View>
//       )}
//     </View>
//   );
// };
