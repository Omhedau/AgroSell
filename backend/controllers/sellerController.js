const seller = require("../models/seller");

   
const createSeller = asyncHandler(async (req, res) => {
  const sellerDetails = req.body;

  console.log('i am in createSeller', sellerDetails); 

  const isVerified = await Otp.findOne({ mobile: sellerDetails.mobile, isVerified: true });

  if (!isVerified) {
    res.status(400);
    throw new Error("Mobile number not verified");
  }

  console.log("i am seller", sellerDetails);

  const seller = await seller.create(sellerDetails);

  console.log("i am mongoman", seller);

  if (seller) {
    const token = generateToken(seller);
    console.log("i am token", token);
    res.status(201).json({ seller, token });
  }
  else {
    res.status(400);
    throw new Error("Invalid seller data");
  }
});

// {
//     "username": "farmer123",
//     "email": "farmer123@example.com",
//     "phoneNumber": "9876543210",
//     "password": "SecurePass@123",
//     "gender": "Male",
//     "profilePicture": "https://example.com/profile.jpg",
//     "storeDetails": {
//         "storeName": "Green Agro Mart",
//         "storeLogo": "https://example.com/store-logo.jpg",
//         "description": "A store for organic farming essentials.",
//         "gstNumber": "27ABCDE1234F1Z5",
//         "businessLicense": "ABC123XYZ",
//         "verificationStatus": "Pending"
//     },
//     "storeAddress": {
//         "street": "Main Road",
//         "district": "Pune",
//         "taluka": "Haveli",
//         "village": "Shirwal",
//         "pincode": "412801",
//         "latitude": 18.5204,
//         "longitude": 73.8567
//     },
//     "bankDetails": {
//         "accountHolderName": "Farmer Kumar",
//         "bankName": "State Bank of India",
//         "accountNumber": "123456789012",
//         "ifscCode": "SBIN0001234",
//         "upiId": "farmerkumar@upi"
//     },
//     "salesStatistics": {
//         "totalOrders": 10,
//         "totalRevenue": 50000,
//         "averageRating": 4.5
//     },
//     "isActive": true
// }


