import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveGameSession = async (userData, score) => {
    try {
        // Fallsback to mock if config is not set (for demo purposes)
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.log("Mocking Firebase Submission:", { ...userData, score });
            return { success: true, id: "mock_id" };
        }

        const docRef = await addDoc(collection(db, "sessions"), {
            ...userData,
            score,
            timestamp: serverTimestamp(),
            deviceType: window.innerWidth > 1024 ? 'kiosk' : 'mobile'
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};
