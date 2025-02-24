import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import images from "@/constants/images";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const SignUp = () => {
  const { mobile } = useLocalSearchParams();
  const mobileNumber = Array.isArray(mobile) ? mobile[0] : mobile;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: mobileNumber || "",
    email: "",
    gender: "Male",
    lang: "English",
    storeName: "",
    storeDescription: "",
    gstNumber: "",
    businessLicense: "",
    street: "",
    district: "", // District will now be selected from a dropdown
    taluka: "",
    village: "",
    pincode: "",
    latitude: "",
    longitude: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const maharashtraDistricts = [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Amravati",
    "Kolhapur",
    "Nanded",
    "Sangli",
    "Jalgaon",
    "Akola",
    "Latur",
    "Dhule",
    "Ahmednagar",
    "Chandrapur",
    "Parbhani",
    "Wardha",
    "Yavatmal",
    "Bhandara",
    "Gondia",
    "Washim",
    "Hingoli",
    "Buldhana",
    "Ratnagiri",
    "Sindhudurg",
    "Raigad",
    "Osmanabad",
    "Nandurbar",
    "Satara",
    "Beed",
    "Gadchiroli",
  ];

  const handleSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const { firstName, lastName, ...rest } = formData;
    const userDetails = { ...rest, name: fullName };

    // signUp(userDetails); // Uncomment and implement this function as needed
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
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Personal Details
          </Text>

          {/* First Name Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            First Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
          />

          {/* Last Name Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            Last Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
          />

          {/* Mobile Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            User Mobile<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-400 font-rubik-semi-bold"
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={formData.mobile}
            editable={false}
          />

          {/* Email Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            Email<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          {/* Gender Selection */}
          <Text className="text-gray-700 font-rubik mb-2">
            Gender<Text style={styles.requiredStar}>*</Text>
          </Text>
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

          {/* Language Selection */}
          <Text className="text-gray-700 font-rubik mb-2">
            Language<Text style={styles.requiredStar}>*</Text>
          </Text>
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

          {/* Separator */}
          <View className="border-b border-green-300 mb-6"></View>

          {/* Store Details Section */}
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Store Details
          </Text>

          {/* Store Name Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            Store Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your store name"
            value={formData.storeName}
            onChangeText={(text) =>
              setFormData({ ...formData, storeName: text })
            }
          />

          {/* Store Logo */}
          <Text className="text-gray-700 font-rubik mb-2">Store Logo</Text>
          <View className="flex-row items-center mb-4">
            <Image
              source={images.camera}
              className="w-8 h-8 mr-2"
              resizeMode="contain"
            />
            <Text className="text-gray-700 font-rubik">Upload Logo</Text>
          </View>

          {/* Store Description */}
          <Text className="text-gray-700 font-rubik mb-2">
            Store Description<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your store description"
            value={formData.storeDescription}
            onChangeText={(text) =>
              setFormData({ ...formData, storeDescription: text })
            }
          />

          {/* GST Number */}
          <Text className="text-gray-700 font-rubik mb-2">
            GST Number<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your GST Number"
            value={formData.gstNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, gstNumber: text })
            }
          />

          {/* Business License */}
          <Text className="text-gray-700 font-rubik mb-2">
            Business License<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
            placeholder="Enter your business license number"
            value={formData.businessLicense}
            onChangeText={(text) =>
              setFormData({ ...formData, businessLicense: text })
            }
          />

          {/* Separator */}
          <View className="border-b border-green-300 mb-6"></View>

          {/* Store Address Section */}
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Store Address
          </Text>

          {/* Street */}
          <Text className="text-gray-700 font-rubik mb-2">
            Street<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your street"
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
          />

          {/* District Dropdown */}
          <Text className="text-gray-700 font-rubik mb-2">
            District<Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            className="border border-gray-300 rounded-lg mb-4 overflow-hidden"
            style={styles.pickerContainer}
          >
            <Picker
              selectedValue={formData.district}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, district: itemValue })
              }
              style={styles.picker}
              dropdownIconColor="#4A5568" // Customize dropdown icon color
              mode="dropdown" // Use dropdown mode for better UX
            >
              <Picker.Item label="Select District" value="" />
              {maharashtraDistricts.map((district) => (
                <Picker.Item key={district} label={district} value={district} />
              ))}
            </Picker>
            {/* Custom Dropdown Icon */}
            <View style={styles.dropdownIcon}>
              <MaterialIcons name="arrow-drop-down" size={24} color="#4A5568" />
            </View>
          </View>

          {/* Taluka */}
          <Text className="text-gray-700 font-rubik mb-2">Taluka</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your taluka"
            value={formData.taluka}
            onChangeText={(text) => setFormData({ ...formData, taluka: text })}
          />

          {/* Village */}
          <Text className="text-gray-700 font-rubik mb-2">Village</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your village"
            value={formData.village}
            onChangeText={(text) => setFormData({ ...formData, village: text })}
          />

          {/* Pincode */}
          <Text className="text-gray-700 font-rubik mb-2">
            Pincode<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your pincode"
            value={formData.pincode}
            onChangeText={(text) => setFormData({ ...formData, pincode: text })}
          />

          {/* Latitude */}
          <Text className="text-gray-700 font-rubik mb-2">
            Latitude<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your latitude"
            value={formData.latitude}
            onChangeText={(text) =>
              setFormData({ ...formData, latitude: text })
            }
          />

          {/* Longitude */}
          <Text className="text-gray-700 font-rubik mb-2">
            Longitude<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
            placeholder="Enter your longitude"
            value={formData.longitude}
            onChangeText={(text) =>
              setFormData({ ...formData, longitude: text })
            }
          />

          {/* Separator */}
          <View className="border-b border-green-300 mb-6"></View>

          {/* Bank Details Section */}
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Bank Details
          </Text>

          {/* Account Holder Name */}
          <Text className="text-gray-700 font-rubik mb-2">
            Account Holder Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your account holder name"
            value={formData.accountHolderName}
            onChangeText={(text) =>
              setFormData({ ...formData, accountHolderName: text })
            }
          />

          {/* Bank Name */}
          <Text className="text-gray-700 font-rubik mb-2">
            Bank Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your bank name"
            value={formData.bankName}
            onChangeText={(text) =>
              setFormData({ ...formData, bankName: text })
            }
          />

          {/* Account Number */}
          <Text className="text-gray-700 font-rubik mb-2">
            Account Number<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your account number"
            value={formData.accountNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, accountNumber: text })
            }
          />

          {/* IFSC Code */}
          <Text className="text-gray-700 font-rubik mb-2">
            IFSC Code<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your IFSC code"
            value={formData.ifscCode}
            onChangeText={(text) =>
              setFormData({ ...formData, ifscCode: text })
            }
          />

          {/* UPI ID */}
          <Text className="text-gray-700 font-rubik mb-2">
            UPI ID<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
            placeholder="Enter your UPI ID"
            value={formData.upiId}
            onChangeText={(text) => setFormData({ ...formData, upiId: text })}
          />

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

const styles = StyleSheet.create({
  pickerContainer: {
    position: "relative",
    backgroundColor: "#F7FAFC", // Light gray background
    borderWidth: 1,
    borderColor: "#E2E8F0", // Light border color
    borderRadius: 8,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#1A202C", // Dark text color
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 12,
    pointerEvents: "none", // Ensure the icon doesn't interfere with Picker clicks
  },
  requiredStar: {
    color: "red",
  },
});

export default SignUp;