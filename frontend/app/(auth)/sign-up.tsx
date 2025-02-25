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
import * as DocumentPicker from "expo-document-picker";
import useSellerStore from "@/store/useSellerStore";

const SignUp = () => {
  const { mobile } = useLocalSearchParams();
  const [filetype, setFileType] = useState("");
  const mobileNumber = Array.isArray(mobile) ? mobile[0] : mobile;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: mobileNumber || "",
    email: "",
    gender: "Male",
    lang: "English",
    storeDetails: {
      storeName: "",
      storeLogo: null as string | null,
      description: "",
      gstNumber: "",
      businessLicense: "",
    },
    storeAddress: {
      street: "",
      district: "", // District will now be selected from a dropdown
      taluka: "",
      village: "",
      pincode: "",
    },
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
    },
  });

  const { signUp } = useSellerStore() as {
    signUp: (formData: any, filetype: string) => Promise<void>;
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    storeName: "",
    description: "",
    gstNumber: "",
    businessLicense: "",
    street: "",
    district: "",
    pincode: "",
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

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Allow all image types
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileType = file.name.split(".").pop() || ""; // Get file extension or default to empty string
        setFileType(fileType); // Fixed variable typo

        setFormData((prevFormData) => ({
          ...prevFormData,
          storeDetails: {
            ...prevFormData.storeDetails,
            storeLogo: file.uri,
          },
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      storeName: "",
      description: "",
      gstNumber: "",
      businessLicense: "",
      street: "",
      district: "",
      pincode: "",
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
    };

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.storeDetails.storeName)
      newErrors.storeName = "Store Name is required";
    if (!formData.storeDetails.description)
      newErrors.description = "Store Description is required";
    if (!formData.storeDetails.gstNumber)
      newErrors.gstNumber = "GST Number is required";
    if (!formData.storeDetails.businessLicense)
      newErrors.businessLicense = "Business License is required";
    if (!formData.storeAddress.street) newErrors.street = "Street is required";
    if (!formData.storeAddress.district)
      newErrors.district = "District is required";
    if (!formData.storeAddress.pincode)
      newErrors.pincode = "Pincode is required";
    if (!formData.bankDetails.accountHolderName)
      newErrors.accountHolderName = "Account Holder Name is required";
    if (!formData.bankDetails.bankName)
      newErrors.bankName = "Bank Name is required";
    if (!formData.bankDetails.accountNumber)
      newErrors.accountNumber = "Account Number is required";
    if (!formData.bankDetails.ifscCode)
      newErrors.ifscCode = "IFSC Code is required";
    if (!formData.bankDetails.upiId) newErrors.upiId = "UPI ID is required";

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Don't submit if the form is invalid
    }

    signUp(formData, filetype);
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
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
          />
          {errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}

          {/* Last Name Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            Last Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
          />
          {errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}

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
          {errors.mobile ? (
            <Text style={styles.errorText}>{errors.mobile}</Text>
          ) : null}

          {/* Email Input */}
          <Text className="text-gray-700 font-rubik mb-2">
            Email<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

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
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your store name"
            value={formData.storeDetails.storeName}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeDetails: { ...formData.storeDetails, storeName: text },
              })
            }
          />
          {errors.storeName ? (
            <Text style={styles.errorText}>{errors.storeName}</Text>
          ) : null}

          <View>
            {/* Store Logo */}
            <Text className="text-gray-700 font-rubik mb-2">Store Logo</Text>
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-row items-center"
              >
                {formData.storeDetails.storeLogo ? (
                  <Image
                    source={{ uri: formData.storeDetails.storeLogo }}
                    className="w-16 h-16 mr-2 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/upload.png")}
                    className="w-8 h-8 mr-2"
                    resizeMode="contain"
                  />
                )}
                <Text className="text-gray-700 font-rubik">Upload Logo</Text>
              </TouchableOpacity>

              {/* Cross Button to Remove Image - Now on Right Side */}
              {formData.storeDetails.storeLogo && (
                <TouchableOpacity
                  onPress={() =>
                    setFormData({
                      ...formData,
                      storeDetails: {
                        ...formData.storeDetails,
                        storeLogo: null,
                      },
                    })
                  }
                  className="ml-4 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center"
                >
                  <Text className="text-white text-sm font-bold">X</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Store Description */}
          <Text className="text-gray-700 font-rubik mb-2">
            Store Description<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your store description"
            value={formData.storeDetails.description}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeDetails: { ...formData.storeDetails, description: text },
              })
            }
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}

          {/* GST Number */}
          <Text className="text-gray-700 font-rubik mb-2">
            GST Number<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your GST Number"
            value={formData.storeDetails.gstNumber}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeDetails: { ...formData.storeDetails, gstNumber: text },
              })
            }
          />
          {errors.gstNumber ? (
            <Text style={styles.errorText}>{errors.gstNumber}</Text>
          ) : null}

          {/* Business License */}
          <Text className="text-gray-700 font-rubik mb-2">
            Business License<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
            placeholder="Enter your business license number"
            value={formData.storeDetails.businessLicense}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeDetails: {
                  ...formData.storeDetails,
                  businessLicense: text,
                },
              })
            }
          />
          {errors.businessLicense ? (
            <Text style={styles.errorText}>{errors.businessLicense}</Text>
          ) : null}

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
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your street"
            value={formData.storeAddress.street}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeAddress: { ...formData.storeAddress, street: text },
              })
            }
          />
          {errors.street ? (
            <Text style={styles.errorText}>{errors.street}</Text>
          ) : null}

          {/* District Dropdown */}
          <Text className="text-gray-700 font-rubik mb-2">
            District<Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            className="border border-gray-300 rounded-lg mb-4 overflow-hidden"
            style={styles.pickerContainer}
          >
            <Picker
              selectedValue={formData.storeAddress.district}
              onValueChange={(itemValue) =>
                setFormData({
                  ...formData,
                  storeAddress: {
                    ...formData.storeAddress,
                    district: itemValue,
                  },
                })
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
          {errors.district ? (
            <Text style={styles.errorText}>{errors.district}</Text>
          ) : null}

          {/* Taluka */}
          <Text className="text-gray-700 font-rubik mb-2">Taluka</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your taluka"
            value={formData.storeAddress.taluka}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeAddress: { ...formData.storeAddress, taluka: text },
              })
            }
          />

          {/* Village */}
          <Text className="text-gray-700 font-rubik mb-2">Village</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800"
            placeholder="Enter your village"
            value={formData.storeAddress.village}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeAddress: { ...formData.storeAddress, village: text },
              })
            }
          />

          {/* Pincode */}
          <Text className="text-gray-700 font-rubik mb-2">
            Pincode<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your pincode"
            value={formData.storeAddress.pincode}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                storeAddress: { ...formData.storeAddress, pincode: text },
              })
            }
          />
          {errors.pincode ? (
            <Text style={styles.errorText}>{errors.pincode}</Text>
          ) : null}

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
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your account holder name"
            value={formData.bankDetails.accountHolderName}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                bankDetails: {
                  ...formData.bankDetails,
                  accountHolderName: text,
                },
              })
            }
          />
          {errors.accountHolderName ? (
            <Text style={styles.errorText}>{errors.accountHolderName}</Text>
          ) : null}

          {/* Bank Name */}
          <Text className="text-gray-700 font-rubik mb-2">
            Bank Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your bank name"
            value={formData.bankDetails.bankName}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                bankDetails: { ...formData.bankDetails, bankName: text },
              })
            }
          />
          {errors.bankName ? (
            <Text style={styles.errorText}>{errors.bankName}</Text>
          ) : null}

          {/* Account Number */}
          <Text className="text-gray-700 font-rubik mb-2">
            Account Number<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your account number"
            value={formData.bankDetails.accountNumber}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                bankDetails: { ...formData.bankDetails, accountNumber: text },
              })
            }
          />
          {errors.accountNumber ? (
            <Text style={styles.errorText}>{errors.accountNumber}</Text>
          ) : null}

          {/* IFSC Code */}
          <Text className="text-gray-700 font-rubik mb-2">
            IFSC Code<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your IFSC code"
            value={formData.bankDetails.ifscCode}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                bankDetails: { ...formData.bankDetails, ifscCode: text },
              })
            }
          />
          {errors.ifscCode ? (
            <Text style={styles.errorText}>{errors.ifscCode}</Text>
          ) : null}

          {/* UPI ID */}
          <Text className="text-gray-700 font-rubik mb-2">
            UPI ID<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
            placeholder="Enter your UPI ID"
            value={formData.bankDetails.upiId}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                bankDetails: { ...formData.bankDetails, upiId: text },
              })
            }
          />
          {errors.upiId ? (
            <Text style={styles.errorText}>{errors.upiId}</Text>
          ) : null}

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});

export default SignUp;
