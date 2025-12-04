package com.pizza.pizzeriaBackend.controller;

import com.pizza.pizzeriaBackend.dto.request.PedidoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.PedidoResponseDto;
import com.pizza.pizzeriaBackend.service.IPedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final IPedidoService pedidoService;

    public PedidoController(IPedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDto> crear(@Valid @RequestBody PedidoCreateDto dto) {
        return ResponseEntity.ok(pedidoService.crearPedido(dto));
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDto>> listar() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPorId(id));
    }

    @GetMapping("/contacto/{contactoId}")
    public ResponseEntity<List<PedidoResponseDto>> listarPorContacto(@PathVariable Long contactoId) {
        return ResponseEntity.ok(pedidoService.listarPorContacto(contactoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
