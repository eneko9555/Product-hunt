"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import { BounceLoader } from "react-spinners"
import stylesError from "../../css/forms.module.css"
import styles from "../../css/product.module.css"
import Link from "next/link";


const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "5rem",
    borderColor: "red",
};

const page = () => {

    const { id } = useParams()
    const { getProduct, loadingProduct, error, productPage, userState, voteFn, alert, handleSubmitComment, deleteProduct } = useAuth()

    const { name, company, createdAt, comments, description, imageURL, url, votes } = productPage
    const [comment, setComment] = useState("")



    useEffect(() => {
        getProduct(id)
    }, [])


    if (loadingProduct) return <BounceLoader
        color={"orange"}
        loading={loadingProduct}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
    />

    function handleSubmit(e) {
        e.preventDefault()
        handleSubmitComment(id, { id: userState.uid, name: userState.displayName, comment })
        setComment("")
    }

    function handleDeleteProduct(e) {
        e.preventDefault()
        if(userState?.uid !== productPage.creatorId) return

        deleteProduct(id)
    }

    return (
        <>
            {error ? (<h2 className={stylesError.error}>El producto no existe</h2>) : productPage.name && (

                <div className={styles.container}>
                    <h1>{name}</h1>

                    <div className={styles.grid}>
                        <div className={styles.grid1}>
                            <img src={imageURL} alt="Imagen producto" />
                            <p className={styles.description}>{description}</p>
                            {userState?.displayName && (
                                <>
                                    <p className={styles.comment}>Agrega tu comentario</p>
                                    <form onSubmit={e => handleSubmit(e)} className={styles.form}>
                                        <input type="text" onChange={e => setComment(e.target.value)} value={comment} />
                                        <input type="submit" value={"Agregar Comentario"} />
                                    </form>
                                </>
                            )}
                        </div>
                        <aside className={styles.grid2}>
                            {productPage.url && <Link className={styles.link} target="_blank" href={url}>Visitar URL</Link>}
                            <p>Publicado por {productPage.creatorName} de {productPage.company}</p>
                            <p style={{ textAlign: "center", marginTop: "5rem", border: "1px solid #ccc", padding: "1rem" }}>{votes + " votos"}</p>
                            {userState?.displayName && (
                                <>
                                    <button onClick={(e) => {
                                        voteFn(id)
                                    }}>Votar</button>
                                    {alert && <p style={{ color: "red", fontWeight: 700, textAlign: "center" }}>{alert}</p>}
                                    {userState?.uid === productPage.creatorId &&
                                        <button style={{ marginTop: "1rem", backgroundColor: "red", color: "white" }} onClick={(e) => {
                                            handleDeleteProduct(e)
                                        }}>Eliminar Producto</button>
                                    }
                                </>
                            )}
                        </aside>
                    </div>
                    <div className={styles.comments}>
                        <h3>Comentarios</h3>
                        {productPage.name && comments?.length > 0 && (
                            <div style={{ borderRadius: "1rem", padding: "1rem", width: "90%" }}>
                                {comments?.map((comment, index) => (
                                    <div key={index}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            <p style={{ fontWeight: 600 }}>Por {comment.name}</p>
                                            {comment.id == productPage.creatorId && (
                                                <span style={{ padding: "1rem", backgroundColor: "#da552f", color: "white", borderRadius: "1rem" }}>Creador</span>
                                            )}

                                        </div>
                                        <p style={{ border: "1px solid #ccc", borderRadius: "1rem", minHeight: "5rem", padding: "1rem" }}>{comment.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            )}
        </>

    )
}

export default page