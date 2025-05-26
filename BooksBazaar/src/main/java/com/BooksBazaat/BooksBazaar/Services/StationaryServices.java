package com.BooksBazaat.BooksBazaar.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.BooksBazaat.BooksBazaar.Entity.StationaryItem;
import com.BooksBazaat.BooksBazaar.Repository.StationaryRepository;

@Service
public class StationaryServices {
    
 private final StationaryRepository repo;

    public StationaryServices(StationaryRepository repo) {
        this.repo = repo;
    }

    public List<StationaryItem> getAllItems() {
        return repo.findAll();
    }

    public StationaryItem addItem(StationaryItem item) {
        return repo.save(item);
    }
}
