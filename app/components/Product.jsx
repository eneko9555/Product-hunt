import styles from "../css/content.module.css"
import Link from "next/link"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { es } from "date-fns/locale"

const Product = ({ p }) => {
    const { id, name, company, createdAt, comments, description, imageURL, url, votes } = p

    return (
        <div className={styles.product}>
            <div className={styles.flex1}>
                <img src={imageURL}  className={styles.img} alt="imagen del producto" />
                <div >
                    <div className={styles.flex2}>
                        <Link href={`/producto/${id}`}><h1 className={styles.title}>{name}</h1></Link>
                        <p className={styles.description}>{description}</p>
                        <div className={styles.comments}>
                            <img className={styles.imgComments} src="/img/comentario.png" alt="icono comentario" />
                            <p>{comments?.length} Comentarios</p>
                        </div>
                    </div>
                  <p>Publicado hace : {formatDistanceToNow(new Date(createdAt), { locale: es })}</p> 
                </div>
            </div>

            <div className={styles.votes}>
                <div>&#9650;</div>
                <div>{votes}</div>
            </div>

        </div>
    )
}

export default Product