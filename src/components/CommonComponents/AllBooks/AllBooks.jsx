import Book from "../Book/Book"
import Pagination from "../Pagination/Pagination"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Loading from "../Loading/Loading"
import NotFound from "../../CommonComponents/NotFound/NotFound"
import { cleanData, getBooks } from "../../../redux/actions/actionBooks.js"
import { formatToCurrency } from "../../../utils/helperFunctions"
import Footer from "../Footer/Footer"

function AllBooks() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBooks())
    return () => {
      dispatch(cleanData())
    }
  }, [])

  const book = useSelector((state) => state.books)
  const allBooks = book.filter(el => !el.order.length > 0)

  const [pageCurrent, setPageCurrent] = useState(1)
  const pageSize = 10
  const indexOfLastBooks = pageCurrent * pageSize
  const indexOfFirstBooks = indexOfLastBooks - pageSize
  const currentBooks = allBooks?.slice(indexOfFirstBooks, indexOfLastBooks)
  const [loading, setLoading] = useState(true)

  if (allBooks?.length > 0 && loading) {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }
  const page = (pageNumber) => {
    setPageCurrent(pageNumber)
  }

  return (
    <>
      <div className="contenedorGral">
        <div className="contenedorBooks">
          {loading ? (
            <Loading />
          ) : currentBooks?.length > 0 && !loading ? (
            currentBooks &&
            currentBooks?.map((e, i) => {
              return (
                <div key={i}>
                  {e.error ? (
                    <h1>¡ERROR!</h1>
                  ) : (
                    <Link id="detail" to={"/details/" + e._id}>
                      <Book
                        id={e?._id}
                        nombre={e?.nombre}
                        image={e?.image}
                        nameUser={e.creador?.nombre}
                        descripcion={e?.descripcion}
                        imageUser={e.creador?.image.url}
                        price={formatToCurrency(e?.price)}
                      />
                    </Link>
                  )}
                </div>
              )
            })
          ) : (
            <NotFound />
          )}
        
          <Pagination
            pageSize={pageSize}
            pageCurrent={pageCurrent}
            allBooks={allBooks?.length}
            page={page}
          />
        </div>

      </div>
      <Footer />
    </>
  )
}

export default AllBooks
