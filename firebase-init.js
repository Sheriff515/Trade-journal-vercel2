import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {initializeFirestore,persistentLocalCache,doc,getDoc,setDoc,collection,getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=initializeFirestore(app,{localCache:persistentLocalCache()});
const lastY={};

// Layout: users/{uid}/data/main = rules, checks, reviews, alarms
//         users/{uid}/years/{YYYY} = that year's trades (keeps every document small)
window.FB={
  login:()=>signInWithPopup(auth,new GoogleAuthProvider()),
  logout:()=>signOut(auth),
  async load(uid){
    const m=await getDoc(doc(db,"users",uid,"data","main"));
    const ys=await getDocs(collection(db,"users",uid,"years"));
    if(!m.exists()&&ys.empty)return null;
    const out=m.exists()?JSON.parse(m.data().j):{};
    out.trades=[];
    ys.forEach(d=>{const j=d.data().j;lastY[d.id]=j;out.trades.push(...JSON.parse(j))});
    return out;
  },
  async save(uid,S){
    const {trades,...rest}=S;
    await setDoc(doc(db,"users",uid,"data","main"),{j:JSON.stringify(rest)});
    const by={};
    (trades||[]).forEach(t=>{(by[t.date.slice(0,4)]=by[t.date.slice(0,4)]||[]).push(t)});
    for(const y of new Set([...Object.keys(by),...Object.keys(lastY)])){
      const j=JSON.stringify(by[y]||[]);
      if(lastY[y]!==j){await setDoc(doc(db,"users",uid,"years",y),{j});lastY[y]=j}
    }
  }
};
onAuthStateChanged(auth,u=>window.onUser&&window.onUser(u));
