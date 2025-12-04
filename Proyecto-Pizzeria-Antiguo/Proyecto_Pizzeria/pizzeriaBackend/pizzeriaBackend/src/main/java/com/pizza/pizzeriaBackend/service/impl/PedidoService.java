package com.pizza.pizzeriaBackend.service.impl;

import com.pizza.pizzeriaBackend.dto.request.PedidoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.PedidoResponseDto;
import com.pizza.pizzeriaBackend.mapper.PedidoMapper;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.model.Pedido;
import com.pizza.pizzeriaBackend.repository.ContactoRepository;
import com.pizza.pizzeriaBackend.repository.LocalRepository;
import com.pizza.pizzeriaBackend.repository.PedidoRepository;
import com.pizza.pizzeriaBackend.service.IPedidoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService implements IPedidoService {

    private final PedidoRepository pedidoRepository;
    private final ContactoRepository contactoRepository;
    private final LocalRepository localRepository;
    private final PedidoMapper mapper;

    public PedidoService(PedidoRepository pedidoRepository, ContactoRepository contactoRepository, LocalRepository localRepository, PedidoMapper mapper) {
        this.pedidoRepository = pedidoRepository;
        this.contactoRepository = contactoRepository;
        this.localRepository = localRepository;
        this.mapper = mapper;
    }

    @Override
    public PedidoResponseDto crearPedido(PedidoCreateDto dto) {
        Contacto contacto = contactoRepository.findById(dto.contactoId())
                .orElseThrow(() -> new RuntimeException("Contacto no encontrado con id: " + dto.contactoId()));

        Local local = localRepository.findById(dto.localId())
                .orElseThrow(() -> new RuntimeException("Local no encontrado con id: " + dto.localId()));

        Pedido pedido = mapper.toEntity(dto);
        pedido.setContacto(contacto);
        pedido.setLocal(local);

        pedidoRepository.save(pedido);
        return mapper.toResponse(pedido);
    }

    @Override
    public List<PedidoResponseDto> listarPedidos() {
        return pedidoRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public PedidoResponseDto obtenerPorId(Long id) {
        return pedidoRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));
    }

    @Override
    public PedidoResponseDto actualizarEstado(Long id, String nuevoEstado) {
        return null;
    }

    @Override
    public List<PedidoResponseDto> listarPorContacto(Long contactoId) {
        return pedidoRepository.findByContactoId(contactoId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        pedidoRepository.deleteById(id);
    }
}
