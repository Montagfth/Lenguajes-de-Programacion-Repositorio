package com.pizza.pizzeriaBackend.repository;

import com.pizza.pizzeriaBackend.model.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    boolean existsByEmail(String email);
}