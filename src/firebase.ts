import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDKxm1CyOwxAsVyBXFEhSOTXa4d9aZUX0Y',
  authDomain: 'nova-pay-1ab4d.firebaseapp.com',
  projectId: 'nova-pay-1ab4d',
  storageBucket: 'nova-pay-1ab4d.firebasestorage.app',
  messagingSenderId: '846007540465',
  appId: '1:846007540465:web:6d20919f04a6d49140e750',
  measurementId: 'G-BL816WZY2J',
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);

export default app;