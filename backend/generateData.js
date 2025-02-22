const mongoose = require("mongoose");
const Machine = require("./models/Machine"); // Assuming you have a Machine model

// MongoDB Connection
mongoose.connect(
    "mongodb+srv://manojnj2309:mongodb!@agrox.xgyp6.mongodb.net/agrox",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

function getRandomRentalTime() {
    const rentalStart = Math.floor(Math.random() * 4) + 7; // 7 to 10
    let rentalEnd = Math.floor(Math.random() * 4) + 17; // 17 to 20

    // Ensure rentalEnd is always greater than rentalStart
    if (rentalEnd <= rentalStart) {
        rentalEnd = rentalStart + 1;
    }

    return { rentalStart, rentalEnd };
}

async function updateRentalTimes() {
    try {
        const machines = await Machine.find({}); // Fetch all machines

        for (let machine of machines) {
            const { rentalStart, rentalEnd } = getRandomRentalTime();

            // Update only if the existing values are incorrect
            if (machine.rentalStart < 7 || machine.rentalStart > 10 || machine.rentalEnd < 17 || machine.rentalEnd > 20) {
                machine.rentalStart = rentalStart;
                machine.rentalEnd = rentalEnd;
                await machine.save();
                console.log(`Updated Machine: ${machine._id} | Start: ${rentalStart} | End: ${rentalEnd}`);
            }
        }

        console.log("✅ All machines updated successfully!");
        mongoose.connection.close(); // Close DB connection
    } catch (error) {
        console.error("❌ Error updating machines:", error);
    }
}

// Run the update function
updateRentalTimes();
