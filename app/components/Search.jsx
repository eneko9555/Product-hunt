import { useEffect } from "react"
import styles from "../css/main.module.css"
import useAuth from "../hooks/useAuth"
import { useRouter } from "next/navigation"

const Search = () => {

  const {search, setSearch} = useAuth()
  const router = useRouter()

  

  function handleSubmitSearch(e){
    e.preventDefault()
    if(search.trim() === "") return
    localStorage.setItem("search", search)
    router.push(`/search/${search}`)
  }

  return (
    <form className={styles.form}
      onSubmit={handleSubmitSearch}
    >
        <input  type="text" placeholder="Buscar Productos" onChange={e => setSearch(e.target.value)} className={styles.inputBase} />
        <button type='submit' className={styles.buttonSearch}></button>
    </form>
  )
}

export default Search