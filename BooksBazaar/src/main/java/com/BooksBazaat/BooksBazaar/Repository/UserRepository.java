package com.BooksBazaat.BooksBazaar.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BooksBazaat.BooksBazaar.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
  Optional<User> findByUsernameOrEmail(String username, String email);

}
