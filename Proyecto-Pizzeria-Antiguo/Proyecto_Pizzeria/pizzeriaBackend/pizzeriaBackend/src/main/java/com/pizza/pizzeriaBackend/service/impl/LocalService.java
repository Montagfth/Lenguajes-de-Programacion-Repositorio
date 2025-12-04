package com.pizza.pizzeriaBackend.service.impl;

import com.pizza.pizzeriaBackend.dto.request.LocalCreateDto;
import com.pizza.pizzeriaBackend.dto.response.LocalResponseDto;
import com.pizza.pizzeriaBackend.mapper.LocalMapper;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.repository.LocalRepository;
import com.pizza.pizzeriaBackend.service.ILocalService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalService implements ILocalService {

    private final LocalRepository localRepository;
    private final LocalMapper localMapper;

    public LocalService(LocalRepository localRepository, LocalMapper localMapper) {
        this.localRepository = localRepository;
        this.localMapper = localMapper;
    }

    @Override
    public LocalResponseDto crearLocal(LocalCreateDto dto) {
        Local local = localMapper.toEntity(dto);
        localRepository.save(local);
        return localMapper.toResponse(local);
    }

    @Override
    public List<LocalResponseDto> listarLocales() {
        return localRepository.findAll()
                .stream()
                .map(localMapper::toResponse)
                .toList();
    }

    @Override
    public LocalResponseDto obtenerPorId(Long id) {
        return localRepository.findById(id)
                .map(localMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Local no encontrado con id: " + id));
    }

    @Override
    public LocalResponseDto actualizar(Long id, LocalCreateDto dto) {
        return null;
    }

    @Override
    public void eliminar(Long id) {
        localRepository.deleteById(id);
    }
}
