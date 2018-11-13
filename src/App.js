import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

import BookShelf from './BookShelf'
import Book from './Book'


class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: [],
    searchedBooks: []
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          books:books
        }))
      })
  }

  updateBook = (thisBook, shelf) => {
    BooksAPI.update(thisBook,shelf)
      .then(() => {
        this.setState((state) => {
          let bookUpdated = false
          const updatedBooks = state.books.map((book) => {
            if (book.id === thisBook.id) {
              book.shelf = shelf
              bookUpdated = true
            } 
            return book
          })

          if (!bookUpdated) {
            thisBook.shelf = shelf
            updatedBooks.push(thisBook)
          }

          const updatedSearchedBooks = state.searchedBooks.map((book) => {
            if (book.id === thisBook.id) {
              book.shelf = shelf
            } 
            return book
          })
    
          return {books: updatedBooks, searchedBooks: updatedSearchedBooks}
        })
      })
  }

  updateSearch = (searchTerm) => {
    if (searchTerm.length > 0) {
      // Search for the books in the API
      BooksAPI.search(searchTerm)
        .then((result) => {
          if (!result.error && result.length > 0) {
            // Updates the results of the search with the shelf position
            result.map((book) => {
              // Search the book from search result in the current shelves 
              const thisBook = this.state.books.find(shelfBook => shelfBook.id === book.id)
              if (thisBook) {
                // Updates the book with the proper shelf
                book.shelf = thisBook.shelf
              }
              return book
            })

            // Updates the current search books
            this.setState(() => ({
              searchedBooks: result
            }))
          } else {
            this.setState(() => ({
              // If the search didn't return anything, update the results with an empty array
              searchedBooks: []
            }))
          }
        })
    } else {
      this.setState(() => ({
        // If the user removes the search query, update the search results to an empty array
        searchedBooks: []
      }))
    }
  }

  render() {
    const readBooks = this.state.books.filter((book) => (book.shelf==="read"))
    const currentlyReadingBooks = this.state.books.filter((book) => (book.shelf==="currentlyReading"))
    const wantToReadBooks = this.state.books.filter((book) => (book.shelf==="wantToRead"))
    const searchedBooks = this.state.searchedBooks

    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" onChange={(event) => this.updateSearch(event.target.value)}/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {searchedBooks.map((book) => (
                      <li key={book.id}>
                          <Book data={book} updateBook={this.updateBook} />
                      </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf title="Currently Reading" books={currentlyReadingBooks} updateBook={this.updateBook} />
                <BookShelf title="Want to Read" books={wantToReadBooks} updateBook={this.updateBook} />
                <BookShelf title="Read" books={readBooks} updateBook={this.updateBook} />
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
