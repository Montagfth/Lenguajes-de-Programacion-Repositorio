package com.pizza.pizzeriaBackend.service.impl;

import com.pizza.pizzeriaBackend.dto.request.MensajeContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.MensajeContactoResponseDto;
import com.pizza.pizzeriaBackend.mapper.MensajeContactoMapper;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.model.MensajeContacto;
import com.pizza.pizzeriaBackend.repository.ContactoRepository;
import com.pizza.pizzeriaBackend.repository.LocalRepository;
import com.pizza.pizzeriaBackend.repository.MensajeContactoRepository;
import com.pizza.pizzeriaBackend.service.IMensajeContactoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeService implements IMensajeContactoService {

    private final MensajeContactoRepository mensajeRepository;
    private final ContactoRepository contactoRepository;
    private final LocalRepository localRepository;
    private final MensajeContactoMapper mapper;

    public MensajeService(MensajeContactoRepository mensajeRepository, ContactoRepository contactoRepository, LocalRepository localRepository, MensajeContactoMapper mapper) {
        this.mensajeRepository = mensajeRepository;
        this.contactoRepository = contactoRepository;
        this.localRepository = localRepository;
        this.mapper = mapper;
    }

    @Override
    public MensajeContactoResponseDto crearMensaje(MensajeContactoCreateDto dto) {
        Contacto contacto = contactoRepository.findById(dto.contactoId())
                .orElseThrow(() -> new RuntimeException("Contacto no encontrado con id: " + dto.contactoId()));

        Local local = dto.localId() != null
                ? localRepository.findById(dto.localId())
                .orElseThrow(() -> new RuntimeException("Local no encontrado con id: " + dto.localId()))
                : null;

        MensajeContacto mensaje = mapper.toEntity(dto);
        mensaje.setContacto(contacto);
        mensaje.setLocal(local);

        mensajeRepository.save(mensaje);
        return mapper.toResponse(mensaje);
    }

    @Override
    public List<MensajeContactoResponseDto> listarMensajes() {
        return mensajeRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public MensajeContactoResponseDto obtenerPorId(Long id) {
        return mensajeRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado con id: " + id));
    }

    @Override
    public List<MensajeContactoResponseDto> listarPorContacto(Long contactoId) {
        return mensajeRepository.findByContactoId(contactoId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        mensajeRepository.deleteById(id);
    }
}