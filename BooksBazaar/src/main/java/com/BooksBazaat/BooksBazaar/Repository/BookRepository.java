package com.BooksBazaat.BooksBazaar.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BooksBazaat.BooksBazaar.Entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
}