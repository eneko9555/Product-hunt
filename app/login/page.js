"use client"
import { useState } from "react"
import useAuth from "../hooks/useAuth"
import { auth } from "../firebase/config"
import styles from "../css/forms.module.css"

export default function page() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {  login, error } = useAuth()


  function handleSubmit(e) {
    e.preventDefault()
    login(auth, email, password)
  }

  return (
    <>
      <h1 className={styles.h1}>Iniciar Sesión</h1>
      <form className={styles.form} onSubmit={handleSubmit} >
        {error && <p className={styles.error}>{error}</p>}
       
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <input type="submit" value={"Iniciar Sesión"} />
      </form>
    </>
  )
}
