package com.pizza.pizzeriaBackend.repository;

import com.pizza.pizzeriaBackend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByContactoId(Long contactoId);
}