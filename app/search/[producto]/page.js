"use client"
import useAuth from "../../hooks/useAuth"
import { useEffect } from "react"
import Product from "../../components/Product"
import styles from "../../css/content.module.css"
import { BounceLoader } from "react-spinners"

const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "2rem",
    borderColor: "red",
};

const page = () => {

    const { handleSearch, productsSearch, loadingSearch } = useAuth()

    useEffect(() => {
        handleSearch()
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {loadingSearch ? <BounceLoader
                        color={"orange"}
                        loading={loadingSearch}
                        cssOverride={override}
                        size={120}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    /> : (
                        productsSearch?.length > 0 ? (
                            productsSearch?.map(p => <Product p={p} key={p.id} />)
                        ) : (
                            <p>No hay resultados para tu busqueda</p>
                        )
                    )}
                </div>
            </div>
        </>
    )
}

export default page