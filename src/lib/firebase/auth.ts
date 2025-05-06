import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

// メールアドレスとパスワードで登録
export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// メールアドレスとパスワードでログイン
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 匿名ログイン（ゲストログイン）
export const guestLogin = () => {
  return signInAnonymously(auth);
};

// Googleでログイン
export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// ログアウト
export const logout = () => {
  return signOut(auth);
};

// 認証状態の監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
