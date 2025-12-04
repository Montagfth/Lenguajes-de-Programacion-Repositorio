package com.pizza.pizzeriaBackend.repository;

import com.pizza.pizzeriaBackend.model.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalRepository extends JpaRepository<Local, Long> {
}
