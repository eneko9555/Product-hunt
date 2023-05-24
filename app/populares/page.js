"use client"
import useAuth from "../hooks/useAuth"
import Product from "../components/Product"
import styles from "../css/content.module.css"


const page = () => {

  const {products} = useAuth()

 const sortedProducts =   [...products].sort((a,b) => b.votes - a.votes )
 
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {sortedProducts?.map(p => <Product p={p} key={p.id} />)}
      </div>
    </div>
  )
}

export default page