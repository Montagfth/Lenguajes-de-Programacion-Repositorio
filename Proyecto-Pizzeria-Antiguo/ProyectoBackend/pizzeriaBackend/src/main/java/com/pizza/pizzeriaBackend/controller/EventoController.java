package com.pizza.pizzeriaBackend.controller;

import com.pizza.pizzeriaBackend.dto.request.EventoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.EventoResponseDto;
import com.pizza.pizzeriaBackend.service.IEventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final IEventoService eventoService;

    public EventoController(IEventoService eventoService) {
        this.eventoService = eventoService;
    }

    @PostMapping
    public ResponseEntity<EventoResponseDto> crear(@Valid @RequestBody EventoCreateDto dto) {
        return ResponseEntity.ok(eventoService.crearEvento(dto));
    }

    @GetMapping
    public ResponseEntity<List<EventoResponseDto>> listar() {
        return ResponseEntity.ok(eventoService.listarEventos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.obtenerPorId(id));
    }

    @GetMapping("/local/{localId}")
    public ResponseEntity<List<EventoResponseDto>> listarPorLocal(@PathVariable Long localId) {
        return ResponseEntity.ok(eventoService.listarPorLocal(localId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eventoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
