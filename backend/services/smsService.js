const axios = require("axios");

// Replace with your actual Fast2SMS API key
const API_KEY = process.env.SMS_API_KEY;

// Function to send SMS
const sendSms = async (numbers, otp) => {
  const url = "https://www.fast2sms.com/dev/bulkV2"; // Fast2SMS API endpoint
  console.log("Sending SMS to:", numbers);
  console.log("API Key:", API_KEY);

  const data = {
    variables_values: otp,
    route: "otp", // Use 'otp' route for OTPs
    numbers: numbers, // Comma-separated phone numbers
  };

  try {
    // Send the POST request using Axios
    console.log("Sending SMS...");
    const response = await axios.post(url, data, {
      headers: {
        authorization: API_KEY, // Use your Fast2SMS API key
      },
    });

    console.log("SMS sent successfully:", response.data);
    return response.data;
  } catch (error) {
    // Handle errors and log the response
    if (error.response) {
      console.error("Error sending SMS:", error.response.data);
      throw new Error(error.response.data.message || "Failed to send SMS.");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while sending SMS.");
    }
  }
};

module.exports = { sendSms };
