import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import images from "@/constants/images";
import { router, useLocalSearchParams } from "expo-router";
import useSellerStore from "@/store/useSellerStore";

const OtpVerification = () => {
  const { mobile } = useLocalSearchParams() as { mobile: string };
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(57);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { verifyOtp, resendOtp } = useSellerStore() as unknown as {
    verifyOtp: (mobile: string, otp: string) => void;
    resendOtp: (mobile: string) => void;
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = () => {
    verifyOtp(mobile, otp.join(""));
  };

  const handleResendOtp = () => {
    setResendTimer(60);
    setOtp(["", "", "", ""]);
    resendOtp(mobile);
    inputRefs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white items-center justify-between px-6 pb-10">
          {/* Logo Section */}
          <View className="items-center mt-10">
            <Image source={images.logo} className="w-20 h-20 mb-6" />
            <Text className="text-xl font-semibold text-gray-800">
              Verify OTP
            </Text>
            <Text className="text-sm text-gray-600 text-center mt-2">
              OTP has been sent to contact number ending with +91{" "}
              <Text className="font-semibold">{mobile.slice(-4)}</Text>
            </Text>
            <Text className="text-primary-500 mt-2 font-medium">
              Change Number
            </Text>
          </View>

          {/* OTP Input Section */}
          <View className="flex-row justify-center w-full mt-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-14 h-14 border border-green-500 rounded-full text-center text-xl font-semibold bg-white shadow-md"
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                onKeyPress={({ nativeEvent: { key } }) =>
                  handleBackspace(key, index)
                }
                style={{ marginHorizontal: 8 }}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerifyOtp}
            className="w-full h-12 bg-primary-500 rounded-full flex items-center justify-center mt-6 shadow-lg"
          >
            <Text className="text-white font-semibold text-lg">Verify</Text>
          </TouchableOpacity>

          {/* Resend OTP Timer */}
          {resendTimer > 0 ? (
            <Text className="text-sm text-gray-600 text-center mt-4">
              Resend OTP in{" "}
              <Text className="text-primary-500">{resendTimer}</Text> seconds
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp} className="mt-4">
              <Text className="text-sm text-primary-500 text-center font-medium">
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer Image */}
          <Image
            source={images.japan}
            className="w-full h-32 mt-6"
            resizeMode="contain"
          />
          <Text className="text-center text-gray-500 text-xs mt-2">
            © Farmease 2025
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;
