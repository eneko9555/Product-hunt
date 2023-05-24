"use client"
import Search from "./Search"
import Link from "next/link"
import styles from "../css/main.module.css"
import useAuth from "../hooks/useAuth"
import { BounceLoader } from "react-spinners"
import { useMemo } from "react"
import { useParams } from "next/navigation"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Header = () => {

    const { userState, signOutSession, loading } = useAuth()
    const {id} = useParams()
    
    return (
        <header >
            <div className={styles.containerHeader}>
                <div className={styles.containerStart}>
                    <p><Link href={"/"}>P</Link></p>
                    <Search />
                    <nav >
                        <Link href={"/"}>Inicio</Link>
                        <Link href={"/populares"}>Populares</Link>
                        {userState && <Link href={"/nuevo-producto"}>Nuevo Producto</Link>}
                    </nav>
                </div>
                {!loading  ? (
                    <div className={styles.containerProfile}>
                        {userState && <p>Hola: {userState?.displayName}</p>}
                        <div className={styles.nav}>
                            {userState ? <Link className={styles.link} href={"/"} onClick={signOutSession}>Cerrar Sesión</Link> : (
                                <>
                                    <Link className={styles.link} href={"/login"}>Login</Link>
                                    <Link className={styles.button} href={"/crear-cuenta"}>Crear Cuenta</Link>
                                </>
                            )}
                        </div>
                    </div>
                ): !id &&( <BounceLoader
                    color={"orange"}
                    loading={loading}
                    cssOverride={override}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />)}
            </div>
        </header>
    )
}

export default Header