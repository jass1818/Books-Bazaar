package com.BooksBazaat.BooksBazaar.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.BooksBazaat.BooksBazaar.Entity.UsedBook;
import com.BooksBazaat.BooksBazaar.Repository.UsedBookRepository;

@Service
public class UsedBookServices {

   private final UsedBookRepository repo;

    public UsedBookServices(UsedBookRepository repo) {
        this.repo = repo;
    }

    public List<UsedBook> getAllUsedBooks() {
        return repo.findAll();
    }

    public UsedBook saveUsedBook(UsedBook book) {
        return repo.save(book);
    }
}

