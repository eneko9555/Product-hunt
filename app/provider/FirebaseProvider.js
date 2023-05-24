"use client"

import FirebaseContext from "../firebase/context"
import { useRouter } from "next/navigation"
import { auth, db, storage } from "../firebase/config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, addDoc, getDocs, orderBy, query, doc, getDoc, updateDoc, deleteDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useEffect, useState } from "react"

const FirebaseProvider = ({ children }) => {

  const [error, setError] = useState("")
  const [alert, setAlert] = useState("")
  const [userState, setUserState] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [product, setProduct] = useState({ votes: 0, comments: [], createdAt: Date.now() })
  const [productPage, setProductPage] = useState({})
  const [image, setImage] = useState(null)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [productsSearch, setProductsSearch] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const checkUser = () => {
      setLoading(true)
      onAuthStateChanged(auth, userState => {
        userState ? setUserState(userState) : setUserState(null)
      })
      setLoading(false)
    }
    checkUser()
  }, [userState])

  // Register
  async function register(auth, email, password, name) {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name
      })
      setUserState(user)
      setLoading(false)
      router.push("/");
    } catch (error) {
      console.log(error);
      const errorMessage = error.message;
      setError(errorMessage.replace("Firebase:", ""));
      setTimeout(() => {
        setError("");
      }, 1500);
      setLoading(false)
    }
  }

  //Login
  async function login(auth, email, password) {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserState(user)
        router.push("/")
        setLoading(false)
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage.replace("Firebase:", ""))
        setTimeout(() => {
          setError("")
        }, 1500)
        setLoading(false)
      });
  }
  // Cerrar sesion

  async function signOutSession() {
    try {
      const signOutS = await signOut(auth)
      setUserState({})
    } catch (error) {
      console.log(error);
    }
  }

  //Product state
  function productOnChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  }

  // add product and image to firestore
  async function addProduct() {
    try {

      const storageRef = ref(storage, image.name);
      await uploadBytes(storageRef, image)
      const imageURL = await getDownloadURL(storageRef)
      const productUpdated = { ...product, creatorId: userState.uid, creatorName: userState.displayName, votesId: [] }
      const docRef = addDoc(collection(db, "products"), { ...productUpdated, imageURL });
      await docRef
      await getProducts()
      setImage(null)
      router.push("/")

    } catch (error) {
      console.log(error);
      router.push("/")
    }
  }

  // Get products from firestore

  const snapProduct = []
  const getProducts = async () => {
    const snapshot = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")))
    snapshot.forEach((p) => {
      const product = { id: p.id, ...p.data() }
      return snapProduct.push(product)
    })
    setProducts(snapProduct)
  }

  useEffect(() => {
    getProducts()
  }, [])

  // Get product by ID

  async function getProduct(id) {
    setLoadingProduct(true)
    setError(false)
    try {
      const productRef = doc(db, "products", id);
      const productSnapshot = await getDoc(productRef);
      if (!productSnapshot.exists()) return setError(true)
      setProductPage(productSnapshot.data())

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProduct(false)
    }
  }

  async function voteFn(id) {

    try {
      const productRef = doc(db, "products", id);
      const productSnapshot = await getDoc(productRef);
      if (productSnapshot.data().votesId.includes(userState.uid)) {
        setAlert("Ya has votado en este producto")
        setTimeout(() => {
          setAlert("")
        }, 2000);
        return
      }
      const currentVotes = productSnapshot.data().votes;
      const newVotes = currentVotes + 1;
      await updateDoc(productRef, {
        votes: newVotes,
        votesId: userState.uid
      })
      setProductPage({ ...productPage, votes: newVotes, id: id })
      const updateStateProducts = products.map(p => {
        if (p.id === id) {
          p.votes = newVotes
          return p
        } else {
          return p
        }
      })
      setProducts(updateStateProducts)
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitComment(id, comment) {
    const productRef = doc(db, "products", id);
    const productSnapshot = (await getDoc(productRef)).data();

    await updateDoc(productRef, {
      comments: [...productSnapshot.comments, comment]
    })

    setProductPage({ ...productSnapshot, comments: [comment, ...productPage.comments] })
  }

  async function deleteProduct(id) {
    const productRef = doc(db, "products", id);
    const productSnapshot = await getDoc(productRef);
    if (productSnapshot.exists()) {
      await deleteDoc(productRef);
      const productsFilterer = products.filter(p => p.id !== id)
      setProducts(productsFilterer)
      router.push("/")
    }
  }

  async function handleSearch() {
    setLoadingSearch(true)
    let searchTerm
    setProductsSearch([])
    try {
      const q = await getDocs(collection(db, "products"))
      if (search === "") {
        searchTerm = localStorage.getItem("search").toLowerCase();
      } else {
        searchTerm = search.toLowerCase();
      }
      q.forEach((doc) => {
        const productName = doc.data().name.toLowerCase();
        if (productName.includes(searchTerm)) {
          setProductsSearch(prevState => [{ id: doc.id, ...doc.data() }, ...prevState])
        }
      });
    } catch (error) {
      console.log(error);
    }

    setLoadingSearch(false)
  }

  return (
    <FirebaseContext.Provider
      value={{
        register,
        error,
        userState,
        login,
        signOutSession,
        alert,
        loading,
        setLoading,
        productOnChange,
        product,
        addProduct,
        image,
        setImage,
        products,
        getProduct,
        loadingProduct,
        productPage,
        voteFn,
        handleSubmitComment,
        deleteProduct,
        setSearch,
        search,
        handleSearch,
        productsSearch,
        loadingSearch
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseProvider