package com.pizza.pizzeriaBackend.service.impl;

import com.pizza.pizzeriaBackend.dto.request.ReservaCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ReservaResponseDto;
import com.pizza.pizzeriaBackend.mapper.ReservaMapper;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.model.Reserva;
import com.pizza.pizzeriaBackend.repository.ContactoRepository;
import com.pizza.pizzeriaBackend.repository.LocalRepository;
import com.pizza.pizzeriaBackend.repository.ReservaRepository;
import com.pizza.pizzeriaBackend.service.IReservaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaService implements IReservaService {

    private final ReservaRepository reservaRepository;
    private final ContactoRepository contactoRepository;
    private final LocalRepository localRepository;
    private final ReservaMapper mapper;

    public ReservaService(ReservaRepository reservaRepository, ContactoRepository contactoRepository, LocalRepository localRepository, ReservaMapper mapper) {
        this.reservaRepository = reservaRepository;
        this.contactoRepository = contactoRepository;
        this.localRepository = localRepository;
        this.mapper = mapper;
    }

    @Override
    public ReservaResponseDto crearReserva(ReservaCreateDto dto) {
        Contacto contacto = contactoRepository.findById(dto.contactoId())
                .orElseThrow(() -> new RuntimeException("Contacto no encontrado con id: " + dto.contactoId()));

        Local local = localRepository.findById(dto.localId())
                .orElseThrow(() -> new RuntimeException("Local no encontrado con id: " + dto.localId()));

        Reserva reserva = mapper.toEntity(dto);
        reserva.setContacto(contacto);
        reserva.setLocal(local);

        reservaRepository.save(reserva);
        return mapper.toResponse(reserva);
    }

    @Override
    public List<ReservaResponseDto> listarReservas() {
        return reservaRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public ReservaResponseDto obtenerPorId(Long id) {
        return reservaRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));
    }

    @Override
    public ReservaResponseDto actualizarEstado(Long id, String nuevoEstado) {
        return null;
    }

    @Override
    public List<ReservaResponseDto> listarPorContacto(Long contactoId) {
        return reservaRepository.findByContactoId(contactoId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        reservaRepository.deleteById(id);
    }
}
