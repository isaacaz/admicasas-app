import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { IAccount, IFormLogin, IFormRegister, IUser } from "../types/user";

const login = async (data: IFormLogin): Promise<IUser> => {
  const { email, password } = data;

  try {
    const response = await auth().signInWithEmailAndPassword(email, password);
    const user = response.user;

    return {
      id: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      account: await getAccount(user.uid),
    };
  } catch (error: any) {
    throw new Error(error.code);
  }
};

// TODO: CHANGE TYPE IFORMLOGIN BY IFORMREGISTER
const register = async (data: IFormRegister) => {
  const { email, password, name } = data;

  try {
    const response = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    const user = response.user;

    // const { user } = await auth().signInAnonymously();

    await firestore()
      .collection("Users")
      .doc(user.uid)
      .set({ rol: "propietario", email, name });
    // auth().signOut();

    // auth().signInWithCustomToken(await user.getIdToken());
    return {
      id: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      account: await getAccount(user.uid),
    };
  } catch (error: any) {
    throw new Error(error.code);
  }
};

const getAccount = async (id: string) => {
  try {
    const docRef = firestore().doc(`Users/${id}`);
    const docSnap = await docRef.get();
    const data = {
      ...(docSnap.data() as IAccount),
      id: docSnap.id,
    } as IAccount;
    return data;
  } catch (e: any) {
    console.log(e);
    console.warn(e.message);
    return {} as IAccount;
  }
};

const refresh = async (user: FirebaseAuthTypes.User): Promise<IUser> => {
  return {
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    account: await getAccount(user.uid),
  };
};

const logout = async () => {
  try {
    await auth().signOut();
  } catch (error: any) {
    throw new Error(error.code);
  }
};

export default { login, register, getAccount, refresh, logout };
