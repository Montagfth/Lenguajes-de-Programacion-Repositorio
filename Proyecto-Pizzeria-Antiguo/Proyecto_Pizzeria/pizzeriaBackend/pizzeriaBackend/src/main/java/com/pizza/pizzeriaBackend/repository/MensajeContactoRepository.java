package com.pizza.pizzeriaBackend.repository;

import com.pizza.pizzeriaBackend.model.MensajeContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeContactoRepository extends JpaRepository<MensajeContacto, Long> {
    List<MensajeContacto> findByContactoId(Long contactoId);
}