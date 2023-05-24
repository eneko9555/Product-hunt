"use client"
import useAuth from "../hooks/useAuth"
import styles from "../css/forms.module.css"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function page() {

  const { product, productOnChange, userState, addProduct, image, setImage } = useAuth()
  const [validate, setValidate] = useState()

  const router = useRouter()

  function handleSubmitProduct(e) {
    e.preventDefault()

    if (!userState) {
      return router.push("/login")
    }
    if (!Object.keys(product).some(k => k === "name" || k === "description") || image === null) {
      setValidate("Los campos nombre, descripción e imagen son obligatorios");
      setTimeout(() => {
        setValidate("")
      }, 2500);
      return
    }
    addProduct()


  }

  return (
    <>
      <h1 className={styles.h1}>Nuevo Producto</h1>
      <form className={styles.form} onSubmit={handleSubmitProduct} >
        {validate && <p style={{ color: "red", fontWeight: 700, textAlign: "center" }}>{validate}</p>}
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={productOnChange}
          />
        </div>

        <div>
          <label htmlFor="password">Empresa</label>
          <input
            type="text"
            id="company"
            name="company"
            onChange={productOnChange}
          />
        </div>

        <div>
          <label htmlFor="email">Imagen</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={e => setImage(e.target.files[0])}
          />
        </div>

        <div>
          <label htmlFor="email">Url</label>
          <input
            type="url"
            id="url"
            name="url"
            onChange={productOnChange}
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            className={styles.textarea}
            id="description"
            name="description"
            onChange={productOnChange}
          />
        </div>
        <input type="submit" value={"Crear Producto"} />
      </form>
    </>
  )
}
