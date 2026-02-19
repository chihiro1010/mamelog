import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  deleteUser,
} from "firebase/auth";
import { auth } from "./firebase";

const ensureAuth = () => {
  if (!auth) {
    throw new Error("Firebase Authが初期化されていません");
  }
  return auth;
};

// メールアドレスとパスワードで登録
export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(ensureAuth(), email.trim(), password);
};

// メールアドレスとパスワードでログイン
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(ensureAuth(), email.trim(), password);
};

// 匿名ログイン（ゲストログイン）
export const guestLogin = () => {
  return signInAnonymously(ensureAuth());
};

// Googleでログイン
export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(ensureAuth(), provider);
};

// ログアウト
export const logout = () => {
  return signOut(ensureAuth());
};

export const deleteCurrentUser = async () => {
  const firebaseAuth = ensureAuth();

  if (!firebaseAuth.currentUser) {
    throw new Error("ログインユーザーが存在しません");
  }

  await deleteUser(firebaseAuth.currentUser);
};

// 認証状態の監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(ensureAuth(), callback);
};
