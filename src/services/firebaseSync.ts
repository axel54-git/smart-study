import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off, Database, Unsubscribe as RTDBUnsubscribe } from 'firebase/database';
import { getFirestore, doc, setDoc, onSnapshot, Firestore, Unsubscribe as FirestoreUnsubscribe } from 'firebase/firestore';
import { ClassCategory, SubjectItem, ChapterItem } from '../data/hierarchyData';
import { MCQChapterItem } from '../data/mcqData';

export interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// User-provided Firebase Configuration
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfigType = {
  apiKey: "AIzaSyDaDfql5hzf8CCFAOVNX0c8xeyfsVJWYQg",
  authDomain: "himrw-fae65.firebaseapp.com",
  databaseURL: "https://himrw-fae65-default-rtdb.firebaseio.com",
  projectId: "himrw-fae65",
  storageBucket: "himrw-fae65.firebasestorage.app",
  messagingSenderId: "697331272278",
  appId: "1:697331272278:web:472670aef644234c78c9f7",
  measurementId: "G-SB7YQMX6R4"
};

const STORAGE_KEY = 'smartstudy_firebase_custom_config_v1';

export function getStoredFirebaseConfig(): FirebaseConfigType {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_FIREBASE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load custom Firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config: FirebaseConfigType) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save custom Firebase config:', e);
  }
}

export function resetFirebaseConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset Firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

import { AdsSystemConfig } from '../data/adsConfig';

export interface AppSyncData {
  homeClasses: ClassCategory[];
  homeSubjects: SubjectItem[];
  homeChapters: ChapterItem[];

  coursesClasses: ClassCategory[];
  coursesSubjects: SubjectItem[];
  coursesChapters: ChapterItem[];

  mcqClasses: ClassCategory[];
  mcqSubjects: SubjectItem[];
  mcqChapters: MCQChapterItem[];

  adsConfig?: AdsSystemConfig;
  updatedAt?: number;
}

class FirebaseSyncManager {
  private app: FirebaseApp | null = null;
  private rtdb: Database | null = null;
  private firestore: Firestore | null = null;
  private currentConfig: FirebaseConfigType = getStoredFirebaseConfig();
  private isConnected = false;
  private lastSyncTime: Date | null = null;
  private rtdbUnsub: RTDBUnsubscribe | null = null;
  private firestoreUnsub: FirestoreUnsubscribe | null = null;
  private listeners: ((data: AppSyncData) => void)[] = [];
  private statusListeners: ((status: { connected: boolean; lastSync: Date | null; error?: string }) => void)[] = [];
  private lastErrorMessage = '';

  constructor() {
    this.init(this.currentConfig);
  }

  public init(config: FirebaseConfigType) {
    this.currentConfig = config;
    try {
      // Disconnect previous listeners
      if (this.rtdbUnsub) {
        this.rtdbUnsub();
        this.rtdbUnsub = null;
      }
      if (this.firestoreUnsub) {
        this.firestoreUnsub();
        this.firestoreUnsub = null;
      }

      // Initialize or reuse app
      const appName = 'smartstudy-app';
      const existingApps = getApps();
      const existing = existingApps.find(a => a.name === appName);
      if (existing) {
        this.app = existing;
      } else {
        this.app = initializeApp(config, appName);
      }

      // Initialize Realtime DB if URL is provided in config options
      if (config.databaseURL) {
        try {
          this.rtdb = getDatabase(this.app);
        } catch (err) {
          console.warn('Realtime Database init warning:', err);
        }
      }

      // Initialize Firestore
      try {
        this.firestore = getFirestore(this.app);
      } catch (err) {
        console.warn('Firestore init warning:', err);
      }

      this.isConnected = true;
      this.lastErrorMessage = '';
      this.notifyStatus();
      this.startListening();
    } catch (err: any) {
      console.error('Firebase initialization error:', err);
      this.isConnected = false;
      this.lastErrorMessage = err?.message || 'Firebase সংযোগে সমস্যা হয়েছে';
      this.notifyStatus();
    }
  }

  public reconfigure(newConfig: FirebaseConfigType) {
    saveStoredFirebaseConfig(newConfig);
    this.init(newConfig);
  }

  public getConfig(): FirebaseConfigType {
    return { ...this.currentConfig };
  }

  public getRTDB(): Database | null {
    if (this.rtdb) return this.rtdb;
    if (this.app) {
      try {
        this.rtdb = getDatabase(this.app);
        return this.rtdb;
      } catch (err) {
        console.warn('Realtime Database getter warning:', err);
      }
    }
    return null;
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      lastSync: this.lastSyncTime,
      error: this.lastErrorMessage
    };
  }

  public onStatusChange(callback: (status: { connected: boolean; lastSync: Date | null; error?: string }) => void) {
    this.statusListeners.push(callback);
    callback(this.getStatus());
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  private notifyStatus() {
    const status = this.getStatus();
    this.statusListeners.forEach(cb => {
      try {
        cb(status);
      } catch (e) {
        console.error(e);
      }
    });
  }

  public subscribe(callback: (data: AppSyncData) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyData(data: AppSyncData) {
    this.lastSyncTime = new Date();
    this.notifyStatus();
    this.listeners.forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error(e);
      }
    });
  }

  private startListening() {
    // 1. Listen to Realtime Database
    if (this.rtdb) {
      try {
        const contentRef = ref(this.rtdb, 'smartstudy/content');
        this.rtdbUnsub = onValue(
          contentRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const val = snapshot.val();
              if (val && (val.homeClasses || val.coursesClasses || val.mcqClasses)) {
                this.isConnected = true;
                this.lastErrorMessage = '';
                this.notifyData(val);
              }
            }
          },
          (err) => {
            console.warn('RTDB listen notice (falling back if needed):', err.message);
            // Don't fully disconnect if Firestore works
          }
        );
      } catch (e: any) {
        console.warn('Failed to attach RTDB listener:', e.message);
      }
    }

    // 2. Listen to Firestore as fallback or complementary
    if (this.firestore) {
      try {
        const docRef = doc(this.firestore, 'smartstudy', 'content');
        this.firestoreUnsub = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const val = docSnap.data() as AppSyncData;
              if (val && (val.homeClasses || val.coursesClasses || val.mcqClasses)) {
                this.isConnected = true;
                this.lastErrorMessage = '';
                this.notifyData(val);
              }
            }
          },
          (err) => {
            console.warn('Firestore listen notice:', err.message);
          }
        );
      } catch (e: any) {
        console.warn('Failed to attach Firestore listener:', e.message);
      }
    }
  }

  public async syncToCloud(data: AppSyncData): Promise<{ success: boolean; message: string }> {
    const payload = {
      ...data,
      updatedAt: Date.now()
    };

    let rtdbSuccess = false;
    let firestoreSuccess = false;
    let errorMsg = '';

    // Write to Realtime Database
    if (this.rtdb) {
      try {
        const contentRef = ref(this.rtdb, 'smartstudy/content');
        await set(contentRef, payload);
        rtdbSuccess = true;
      } catch (err: any) {
        console.warn('Realtime Database sync notice:', err.message);
        errorMsg = err.message;
      }
    }

    // Write to Firestore
    if (this.firestore) {
      try {
        const docRef = doc(this.firestore, 'smartstudy', 'content');
        await setDoc(docRef, payload, { merge: true });
        firestoreSuccess = true;
      } catch (err: any) {
        console.warn('Firestore sync notice:', err.message);
        if (!errorMsg) errorMsg = err.message;
      }
    }

    if (rtdbSuccess || firestoreSuccess) {
      this.lastSyncTime = new Date();
      this.lastErrorMessage = '';
      this.isConnected = true;
      this.notifyStatus();
      return { success: true, message: 'সফলভাবে ফায়ারবেস ক্লাউডে আপলোড হয়েছে!' };
    } else {
      this.lastErrorMessage = errorMsg || 'ফায়ারবেসে ডাটা পাঠাতে ব্যর্থ হয়েছে';
      this.notifyStatus();
      return {
        success: false,
        message: errorMsg ? `ফায়ারবেস নোটিস: ${errorMsg}` : 'ফায়ারবেসে লিখতে সমস্যা হয়েছে। লোকাল মেমোরিতে সেভ রাখা হয়েছে।'
      };
    }
  }
}

export const firebaseSync = new FirebaseSyncManager();
