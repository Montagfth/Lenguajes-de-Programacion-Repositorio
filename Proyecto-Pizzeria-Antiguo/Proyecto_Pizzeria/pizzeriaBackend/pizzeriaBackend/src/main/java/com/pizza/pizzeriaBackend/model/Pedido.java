package com.pizza.pizzeriaBackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    public enum EstadoPedido {
        PENDIENTE, PREPARANDO, ENVIADO, ENTREGADO, CANCELADO
    }

    public enum MetodoPago {
        EFECTIVO, TARJETA, TRANSFERENCIA, PAYPAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaPedido;
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago = MetodoPago.EFECTIVO;

    private boolean delivery = false;
    private String direccionEnvio;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "local_id", nullable = false)
    private Local local;

    @ManyToOne
    @JoinColumn(name = "contacto_id", nullable = false)
    private Contacto contacto;
}