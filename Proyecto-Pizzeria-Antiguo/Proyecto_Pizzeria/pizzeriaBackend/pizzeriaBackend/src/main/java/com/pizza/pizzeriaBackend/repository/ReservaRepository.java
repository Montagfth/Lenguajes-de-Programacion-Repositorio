package com.pizza.pizzeriaBackend.repository;

import com.pizza.pizzeriaBackend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByContactoId(Long contactoId);
}
