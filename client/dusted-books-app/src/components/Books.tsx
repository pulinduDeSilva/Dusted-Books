import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Search from './customer/Search'

type BookItem = {
  _id: string
  title: string
  price: number
  category?: string[]
  description?: string
  condition?: string
  imgUrl?: string
}

const Books = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState<BookItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books')
        if (!response.ok) throw new Error('Failed to fetch books')

        const data = await response.json()
        setBooks(data.slice(0, 5))
      } catch (error) {
        console.error('Failed to load books:', error)
        setBooks([])
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    if (books.length === 0) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % books.length)
    }, 3500)

    setActiveIndex(0)
    return () => window.clearInterval(timer)
  }, [books.length])

  const visibleBooks = useMemo(
    () => (books.length > 0 ? [0, 1, 2].map((offset) => books[(activeIndex + offset) % books.length]) : []),
    [books, activeIndex],
  )

  return (
    <section className="w-full px-3 py-6 sm:px-4 md:px-8 md:py-8 md:mx-auto  lg:max-w-8xl ">
      <Search />

      <div className=" flex items-center justify-center gap-3 mx-20 my-20">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 inline-block">Preloved Book Shelf</p>
          <h2 className="lg:text-2xl font-semibold text-stone-800 dark:text-gray-100 text-2xl inline-block">Simple picks for every reader</h2>
        </div>
        
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full md:w-2/3 mx-3">
          {visibleBooks.map((book) => (
            <article
              key={book._id}
              onClick={() => navigate(`/user/books/${book._id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(`/books/${book._id}`)
                }
              }}
              tabIndex={0}
              role="button"
              className="cursor-pointer rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20"
            >
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-1 font-medium text-amber-700 dark:text-amber-300">
                  {book.category?.[0] || 'Featured'}
                </span>
              </div>

              <div className="flex min-h-[220px] items-center justify-center rounded-lg  dark:bg-gray-700/50 p-3">
                <img
                  className="max-h-48 w-full object-contain"
                  src={book.imgUrl}
                  alt={book.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="m-3">
                <p className="text-sm font-semibold text-stone-800 dark:text-gray-100">{book.title}</p>
                <p className="mt-1 text-sm text-stone-600 dark:text-gray-400">{book.description || book.condition || 'Good condition copy'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-amber-700 dark:text-amber-400">Rs. {book.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Books