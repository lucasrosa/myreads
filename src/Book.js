import React, { Component } from 'react'

class Book extends Component {
    handleChange(event) {
        this.props.updateBook(event.target.value)
    }

    render() {
        return <div className="book">
            <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.data.imageLinks.thumbnail})` }}></div>
            <div className="book-shelf-changer">
                <select value={this.props.data.shelf} onChange={(event) => {this.props.updateBook(this.props.data.id, event.target.value)}}>
                    <option value="move" disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                </select>
            </div>
            </div>
            <div className="book-title">{this.props.data.title}</div>
            <div className="book-authors">{this.props.data.authors.map((author, index) => (
                // If it is the last name in the list, don't add the comma
                (index+1)===this.props.data.authors.length ? author : author + ', '
            ))}</div>
        </div>
    }
}

export default Book
