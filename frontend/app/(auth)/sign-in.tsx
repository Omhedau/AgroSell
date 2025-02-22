import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import images from "@/constants/images";
import useUserStore from "@/store/userStore";

interface Translations {
  en: {
    welcome: string;
    mobilePlaceholder: string;
    continue: string;
  };
  hi: {
    welcome: string;
    mobilePlaceholder: string;
    continue: string;
  };
  mr: {
    welcome: string;
    mobilePlaceholder: string;
    continue: string;
  };
}

export default function SignIn(): JSX.Element {
  const { language } = useLanguage(); // Get the current language from context
  const [mobile, setMobile] = useState<string>(""); // State for mobile number
  const { signIn } = useUserStore() as { signIn: (mobile: string) => void };

  const translations: Translations = {
    en: {
      welcome: "Welcome to Farmease!",
      mobilePlaceholder: "Enter your mobile number",
      continue: "CONTINUE",
    },
    hi: {
      welcome: "फार्मईज में आपका स्वागत है!",
      mobilePlaceholder: "अपना मोबाइल नंबर दर्ज करें",
      continue: "जारी रखें",
    },
    mr: {
      welcome: "फार्मईजमध्ये आपले स्वागत आहे!",
      mobilePlaceholder: "तुमचा मोबाईल नंबर प्रविष्ट करा",
      continue: "सुरू ठेवा",
    },
  };

  const t = translations[language as keyof Translations];

  // Validate mobile number
  const isValidMobile = (number: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(number);
  };

  const handleContinue = () => {
    if (!mobile) {
      Alert.alert("Error", "Please enter your mobile number.");
      return;
    }

    if (!isValidMobile(mobile)) {
      Alert.alert("Invalid Input", "Please enter a valid 10-digit mobile number.");
      return;
    }

    signIn(mobile);
   
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white px-5">
          <View className="flex-1 justify-center items-center pb-12">
            <Image
              source={images.logo}
              className="w-24 h-24 mb-3"
              resizeMode="contain"
            />

            <Text className="text-2xl font-bold text-primary-500 mb-8">
              {t.welcome}
            </Text>

            <TextInput
              className="w-full h-18 border-b border-gray-300 text-xl font-rubik caret-transparent rounded-full text-center mb-5 px-3"
              placeholder={t.mobilePlaceholder}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={(text) => setMobile(text)}
            />

            <TouchableOpacity
              onPress={handleContinue}
              className="w-full h-12 font-rubik bg-green-700 rounded-full justify-center items-center mt-5"
            >
              <Text className="text-white text-base font-bold">{t.continue}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
