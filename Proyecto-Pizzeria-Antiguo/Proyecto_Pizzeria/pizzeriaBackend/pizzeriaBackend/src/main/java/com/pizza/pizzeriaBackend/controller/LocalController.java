package com.pizza.pizzeriaBackend.controller;

import com.pizza.pizzeriaBackend.dto.request.LocalCreateDto;
import com.pizza.pizzeriaBackend.dto.response.LocalResponseDto;
import com.pizza.pizzeriaBackend.service.ILocalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/locales")
public class LocalController {

    private final ILocalService localService;

    public LocalController(ILocalService localService) {
        this.localService = localService;
    }

    @PostMapping
    public ResponseEntity<LocalResponseDto> crear(@Valid @RequestBody LocalCreateDto dto) {
        return ResponseEntity.ok(localService.crearLocal(dto));
    }

    @GetMapping
    public ResponseEntity<List<LocalResponseDto>> listar() {
        return ResponseEntity.ok(localService.listarLocales());
    }


    @GetMapping("/{id}")
    public ResponseEntity<LocalResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(localService.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        localService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
