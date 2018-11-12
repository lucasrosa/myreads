import React, { Component } from 'react'
import Book from './Book'

class BookShelf extends Component {
    render() {
        const books = this.props.books

        return <div className="bookshelf">
            <h2 className="bookshelf-title">{this.props.title}</h2>
            <div className="bookshelf-books">
            <ol className="books-grid">
                {books.map((book) => (
                    <li key={book.id}>
                        <Book data={book} updateBook={this.props.updateBook} />
                    </li>
                ))}
            </ol>
            </div>
        </div>
    }
}

export default BookShelf