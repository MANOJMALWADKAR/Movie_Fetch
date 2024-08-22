import { useState, useEffect } from 'react'


const KEY = '578ac5ee'

export function useMovies(query, callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(function () {
        callback?.()
        const controller = new AbortController()

        async function fetchMovies() {
            try {
                setIsLoading(true)
                setError('')

                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                    { signal: controller.signal })
                const data = await res.json()

                if (data.Response === 'False') throw new Error('movie not found')
                setMovies(data.Search)
                setError('')
                // console.log(data)
            } catch (err) {
                console.error(err.message)
                if (err.message === 'Failed to fetch') setError('something went wrong')
                else if (err.name !== 'AbortError') {
                    setError(err.message)
                }

            }
            finally {
                setIsLoading(false)
            }
        }
        if (!query.length) {
            setMovies([])
            setError('')
            return
        }

        fetchMovies()

        return function () {
            controller.abort()
        }
    }, [query])

    return { movies, isLoading, error }
}