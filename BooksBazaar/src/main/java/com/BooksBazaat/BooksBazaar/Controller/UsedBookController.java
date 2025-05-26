package com.BooksBazaat.BooksBazaar.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BooksBazaat.BooksBazaar.Entity.UsedBook;
import com.BooksBazaat.BooksBazaar.Services.UsedBookServices;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/used-books")
public class UsedBookController {

     private final UsedBookServices service;

    public UsedBookController(UsedBookServices service) {
        this.service = service;
    }

    @GetMapping
    public List<UsedBook> getAllUsedBooks() {
        return service.getAllUsedBooks();
    }

    @PostMapping
    public UsedBook addUsedBook(@RequestBody UsedBook book) {
        return service.saveUsedBook(book);
    }

}
