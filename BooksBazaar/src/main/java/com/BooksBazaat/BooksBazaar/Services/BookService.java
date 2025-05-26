package com.BooksBazaat.BooksBazaar.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BooksBazaat.BooksBazaar.Entity.Book;
import com.BooksBazaat.BooksBazaar.Repository.BookRepository;

@Service
public class BookService {

  @Autowired
    private BookRepository bookRepo;

    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    public Book saveBook(Book book) {
        return bookRepo.save(book);
    }
}
