const Product = require('../models/product'); // Assuming the Product model is in the models folder

const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(400).json({ message: 'Error adding product', error });
    }
};

// {
//     "sellerId": "65f8c2d6e2b4a1a4d3f67e89",  
//     "name": "Organic Wheat Seeds",
//     "description": "High-quality organic wheat seeds suitable for various soil types, ensuring a healthy yield.",
//     "category": "Seeds",
//     "subCategory": "Wheat Seeds",
//     "brand": "AgroGreen",
//     "images": [
//         "https://example.com/images/wheat-seeds-1.jpg",
//         "https://example.com/images/wheat-seeds-2.jpg"
//     ],
//     "price": {
//         "mrp": 1200,
//         "sellingPrice": 999,
//         "discountPercentage": 16.75
//     },
//     "stock": {
//         "quantity": 100,
//         "lowStockThreshold": 5
//     },
//     "specifications": {
//         "weight": "50kg",
//         "composition": "100% Organic Wheat",
//         "usageInstructions": "Sow in fertile soil, water regularly, and ensure proper sunlight.",
//         "cropSuitability": ["Wheat"],
//         "soilType": ["Loamy", "Clay"],
//         "organic": true
//     },
//     "variants": [
//         {
//             "variantName": "Weight",
//             "options": [
//                 { "name": "25kg", "additionalPrice": -200 },
//                 { "name": "50kg", "additionalPrice": 0 },
//                 { "name": "100kg", "additionalPrice": 1500 }
//             ]
//         }
//     ],
//     "tags": ["organic", "wheat seeds", "high yield", "agriculture"],
// 
//     "returnPolicy": "7-day return available",
//     "isActive": true
// }


module.exports = { addProduct };