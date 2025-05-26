package com.BooksBazaat.BooksBazaar.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BooksBazaat.BooksBazaar.Entity.StationaryItem;
import com.BooksBazaat.BooksBazaar.Services.StationaryServices;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/stationary")
public class StationaryController {

    private final StationaryServices service;

    public StationaryController(StationaryServices service) {
        this.service = service;
    }

    @GetMapping
    public List<StationaryItem> getAllItems() {
        return service.getAllItems();
    }

    @PostMapping
    public StationaryItem addItem(@RequestBody StationaryItem item) {
        return service.addItem(item);
    }
}
