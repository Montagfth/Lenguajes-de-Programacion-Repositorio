package com.pizza.pizzeriaBackend.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    public enum EstadoEvento {
        ACTIVO, INACTIVO, CANCELADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer aforoMaximo;

    @Enumerated(EnumType.STRING)
    private EstadoEvento estado = EstadoEvento.ACTIVO;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "local_id", nullable = false)
    private Local local;
}