import { useContext } from "react";
import FirebaseContext from "../firebase/context"

const useAuth = () => {
  return useContext(FirebaseContext)
}

export default useAuth