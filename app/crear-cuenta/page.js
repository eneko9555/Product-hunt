"use client"

import styles from "../css/forms.module.css"
import useAuth from "../hooks/useAuth"
import { auth } from "../firebase/config"
import { useState } from "react"


const page = () => {

  const {register, error, alert} = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

   function handleSubmit(e){
    e.preventDefault()
    register(auth, email, password, name)
  }

  return (
    <>
      <h1 className={styles.h1}>Crear Cuenta</h1>
      <form className={styles.form} onSubmit={handleSubmit} >
        {error && <p className={styles.error}>{error}</p>}
        {alert && <p className={styles.alert}>{alert}</p>}

        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id = "name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />  
        </div>
       
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id = "password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id = "email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>   
        <input  type="submit" value={"Crear Cuenta"}/>
      </form>
    </>
  )
}

export default page