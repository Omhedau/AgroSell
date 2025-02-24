import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import images from "@/constants/images";
import { useLocalSearchParams, useRouter } from "expo-router";
import useUserStore from "@/store/useSellerStore";

const SignUp = () => {
  const { mobile } = useLocalSearchParams();
  const mobileNumber = Array.isArray(mobile) ? mobile[0] : mobile;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: mobileNumber || "",
    gender: "Male",
    lang: "English",
  });
  const { signUp } = useUserStore() as { signUp: (userDetails: any) => void };

  const handleSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const { firstName, lastName, ...rest } = formData;
    const userDetails = { ...rest, name: fullName  };

    signUp(userDetails);

  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-white px-6 py-10">
        {/* Logo */}
        <View className="items-center mt-10">
          <Image source={images.logo} className="w-20 h-20 mb-6" />
        </View>

        <View className="items-center mb-6">
          <Text className="text-2xl font-rubik-bold text-primary-500">
            Sign up and join us
          </Text>
        </View>

        {/* Form Fields */}
        <View>
          {/* First Name Input */}
          <Text className="text-gray-700 font-rubik mb-2">First Name</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
          />

          {/* Last Name Input */}
          <Text className="text-gray-700 font-rubik mb-2">Last Name</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
          />

          {/* Mobile Input */}
          <Text className="text-gray-700 font-rubik mb-2">User Mobile</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-400 font-rubik-semi-bold"
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={formData.mobile}
            editable={false}
          />

          {/* Gender Selection */}
          <Text className="text-gray-700 font-rubik mb-2">Gender</Text>
          <View className="flex-row justify-between mb-4">
            {["Male", "Female", "Other"].map((g) => (
              <TouchableOpacity
                key={g}
                className={`flex-1 items-center py-3 border ${
                  formData.gender === g
                    ? "border-primary-500 bg-primary-100"
                    : "border-gray-300"
                } rounded-lg mx-1`}
                onPress={() => setFormData({ ...formData, gender: g })}
              >
                <Text
                  className={`font-rubik-medium ${
                    formData.gender === g ? "text-primary-500" : "text-gray-600"
                  }`}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* lang Selection */}
          <Text className="text-gray-700 font-rubik mb-2">language</Text>
          <View className="flex-row justify-between mb-6">
            {["English", "मराठी", "हिंदी"].map((lang) => (
              <TouchableOpacity
                key={lang}
                className={`flex-1 items-center py-3 border ${
                  formData.lang === lang
                    ? "border-primary-500 bg-primary-100"
                    : "border-gray-300"
                } rounded-lg mx-1`}
                onPress={() => setFormData({ ...formData, lang: lang })}
              >
                <Text
                  className={`font-rubik-medium ${
                    formData.lang === lang
                      ? "text-primary-500"
                      : "text-gray-600"
                  }`}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="w-full h-12 bg-primary-500 rounded-full flex items-center justify-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-rubik-semibold text-lg">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text className="text-center text-gray-500 text-xs mt-6">
          © Farmease 2025
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignUp;
