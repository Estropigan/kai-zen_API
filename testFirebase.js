import { db } from "./src/config/firebase.js";

async function testFirestore() {
  try {
    await db.collection("test").add({ message: "Firestore is working!" });
    console.log("Firestore is connected successfully.");
  } catch (error) {
    console.error("Firestore connection error:", error);
  }
}

testFirestore();
