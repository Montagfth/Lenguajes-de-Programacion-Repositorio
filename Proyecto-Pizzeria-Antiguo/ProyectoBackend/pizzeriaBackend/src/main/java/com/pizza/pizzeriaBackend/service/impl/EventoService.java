package com.pizza.pizzeriaBackend.service.impl;

import com.pizza.pizzeriaBackend.dto.request.EventoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.EventoResponseDto;
import com.pizza.pizzeriaBackend.mapper.EventoMapper;
import com.pizza.pizzeriaBackend.model.Evento;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.repository.EventoRepository;
import com.pizza.pizzeriaBackend.repository.LocalRepository;
import com.pizza.pizzeriaBackend.service.IEventoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoService implements IEventoService {

    private final EventoRepository eventoRepository;
    private final LocalRepository localRepository;
    private final EventoMapper eventoMapper;

    public EventoService(EventoRepository eventoRepository, LocalRepository localRepository, EventoMapper eventoMapper) {
        this.eventoRepository = eventoRepository;
        this.localRepository = localRepository;
        this.eventoMapper = eventoMapper;
    }

    @Override
    public EventoResponseDto crearEvento(EventoCreateDto dto) {
        Local local = localRepository.findById(dto.localId())
                .orElseThrow(() -> new RuntimeException("Local no encontrado con id: " + dto.localId()));

        Evento evento = eventoMapper.toEntity(dto);
        evento.setLocal(local);
        eventoRepository.save(evento);

        return eventoMapper.toResponse(evento);
    }

    @Override
    public List<EventoResponseDto> listarEventos() {
        return eventoRepository.findAll()
                .stream()
                .map(eventoMapper::toResponse)
                .toList();
    }

    @Override
    public EventoResponseDto obtenerPorId(Long id) {
        return eventoRepository.findById(id)
                .map(eventoMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con id: " + id));
    }

    @Override
    public EventoResponseDto actualizar(Long id, EventoCreateDto dto) {
        return null;
    }

    @Override
    public List<EventoResponseDto> listarPorLocal(Long localId) {
        return eventoRepository.findByLocalId(localId)
                .stream()
                .map(eventoMapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        eventoRepository.deleteById(id);
    }
}
