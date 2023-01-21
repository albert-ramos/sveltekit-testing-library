import { getFirestore } from 'firebase/firestore';
import app from '@/shared/firebase/AppSetup';

const db = getFirestore(app);

export default db;
