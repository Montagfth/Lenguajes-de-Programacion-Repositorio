package com.pizza.pizzeriaBackend.controller;

import com.pizza.pizzeriaBackend.dto.request.ReservaCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ReservaResponseDto;
import com.pizza.pizzeriaBackend.service.IReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final IReservaService reservaService;

    public ReservaController(IReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDto> crear(@Valid @RequestBody ReservaCreateDto dto) {
        return ResponseEntity.ok(reservaService.crearReserva(dto));
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponseDto>> listar() {
        return ResponseEntity.ok(reservaService.listarReservas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    @GetMapping("/contacto/{contactoId}")
    public ResponseEntity<List<ReservaResponseDto>> listarPorContacto(@PathVariable Long contactoId) {
        return ResponseEntity.ok(reservaService.listarPorContacto(contactoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reservaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
