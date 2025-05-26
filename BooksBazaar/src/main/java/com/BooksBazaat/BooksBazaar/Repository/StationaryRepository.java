package com.BooksBazaat.BooksBazaar.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BooksBazaat.BooksBazaar.Entity.StationaryItem;

public interface StationaryRepository extends JpaRepository<StationaryItem, Long>{

}
