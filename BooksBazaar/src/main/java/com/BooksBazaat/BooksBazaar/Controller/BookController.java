package com.BooksBazaat.BooksBazaar.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BooksBazaat.BooksBazaar.Entity.Book;
import com.BooksBazaat.BooksBazaar.Services.BookService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*") // allow cross-origin for testing
public class BookController {

   private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }
  // You can add POST, PUT, DELETE methods later for full CRUD
}
