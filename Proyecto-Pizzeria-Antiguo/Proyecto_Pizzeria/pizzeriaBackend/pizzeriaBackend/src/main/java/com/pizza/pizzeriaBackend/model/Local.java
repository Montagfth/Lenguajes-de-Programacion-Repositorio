package com.pizza.pizzeriaBackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "locales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String direccion;
    private String ciudad;
    private String telefono;
    private String email;
    private Integer capacidad;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private boolean activo = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL)
    private List<Pedido> pedidos;

    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL)
    private List<Reserva> reservas;

    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL)
    private List<Evento> eventos;
}