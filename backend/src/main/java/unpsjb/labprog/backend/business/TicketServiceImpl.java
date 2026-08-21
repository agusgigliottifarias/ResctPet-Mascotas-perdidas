package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.TicketResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.TicketRepository;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketResponseFactory ticketResponseFactory;
    private final TicketFinderService ticketFinderService;
    private final TicketValidatorService ticketValidatorService;
    private final TicketPedidoService ticketPedidoService;
    private final TicketMapper ticketMapper;
    private final TicketEstadoWorkflowService ticketEstadoWorkflowService;

    @Override
    public Ticket obtenerPorPedido(String codigoPedido) {
        return ticketFinderService.obtenerTicketPorCodigoPedido(codigoPedido);
    }

    @Override
    public Ticket obtenerPorRestauranteYTicket(
            String codigoRestaurante,
            String codigoTicket
    ) {
        Restaurante restaurante
                = ticketFinderService.obtenerRestaurantePorCodigo(codigoRestaurante);

        Ticket ticket
                = ticketFinderService.obtenerTicketPorCodigo(codigoTicket);

        if (!ticket.getIdRestaurante().equals(restaurante.getIdRestaurante())) {
            throw conflicto("TICKET_NO_PERTENECE_AL_RESTAURANTE");
        }

        return ticket;
    }

    @Override
    @Transactional
    public Ticket marcarEnPreparacion(String codigoPedido) {
        Ticket ticket
                = ticketFinderService.obtenerTicketPorCodigoPedido(codigoPedido);

        return ticketEstadoWorkflowService.cambiarAEnPreparacion(ticket);
    }

    @Override
    @Transactional
    public Ticket marcarEnPreparacion(
            String codigoRestaurante,
            String codigoTicket
    ) {
        Ticket ticket = obtenerPorRestauranteYTicket(
                codigoRestaurante,
                codigoTicket
        );

        return ticketEstadoWorkflowService.cambiarAEnPreparacion(ticket);
    }

    @Override
    @Transactional
    public Ticket marcarListo(String codigoPedido) {
        Ticket ticket
                = ticketFinderService.obtenerTicketPorCodigoPedido(codigoPedido);

        return ticketEstadoWorkflowService.cambiarAListo(ticket);
    }

    @Override
    @Transactional
    public Ticket marcarListo(
            String codigoRestaurante,
            String codigoTicket
    ) {
        Ticket ticket = obtenerPorRestauranteYTicket(
                codigoRestaurante,
                codigoTicket
        );

        return ticketEstadoWorkflowService.cambiarAListo(ticket);
    }

    @Override
    public TicketResponseDTO obtenerRespuestaPorRestauranteYTicket(
            String codigoRestaurante,
            String codigoTicket
    ) {
        Ticket ticket = obtenerPorRestauranteYTicket(
                codigoRestaurante,
                codigoTicket
        );

        return ticketMapper.toDTO(ticket);
    }

    @Override
    @Transactional
    public TicketResponseDTO marcarEnPreparacionRespuesta(
            String codigoRestaurante,
            String codigoTicket
    ) {
        Ticket ticketAntes = obtenerPorRestauranteYTicket(
                codigoRestaurante,
                codigoTicket
        );

        boolean idempotente = ticketAntes.getInicioPreparacion() != null;

        Ticket ticket = marcarEnPreparacion(
                codigoRestaurante,
                codigoTicket
        );

        return ticketResponseFactory.construir(ticket, idempotente);
    }

    @Override
    @Transactional
    public TicketResponseDTO marcarEnPreparacionRespuestaPorPedido(
            String codigoPedido
    ) {
        Ticket ticketAntes = obtenerPorPedido(codigoPedido);

        boolean idempotente = ticketAntes.getInicioPreparacion() != null;

        Ticket ticket = marcarEnPreparacion(codigoPedido);

        return ticketResponseFactory.construir(ticket, idempotente);
    }

    @Override
    @Transactional
    public TicketResponseDTO marcarListoRespuesta(
            String codigoRestaurante,
            String codigoTicket
    ) {
        Ticket ticketAntes = obtenerPorRestauranteYTicket(
                codigoRestaurante,
                codigoTicket
        );

        boolean idempotente = ticketAntes.getFinPreparacion() != null;

        Ticket ticket = marcarListo(
                codigoRestaurante,
                codigoTicket
        );

        return ticketResponseFactory.construir(ticket, idempotente);
    }

    @Override
    @Transactional
    public TicketResponseDTO marcarListoRespuestaPorPedido(
            String codigoPedido
    ) {
        Ticket ticketAntes = obtenerPorPedido(codigoPedido);

        boolean idempotente = ticketAntes.getFinPreparacion() != null;

        Ticket ticket = marcarListo(codigoPedido);

        return ticketResponseFactory.construir(ticket, idempotente);
    }

    @Override
    @Transactional
    public Ticket crearTicketPrevioParaPedido(
            String codigoPedido
    ) {
        return ticketPedidoService.crearTicketPrevioParaPedido(codigoPedido);
    }

    @Override
    public List<Ticket> obtenerTodos() {
        return ticketRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDTO> consultarTiemposPreparacion(
            String codigoRestaurante,
            String desde,
            String hasta,
            int page,
            int size
    ) {
        Instant fechaDesde;
        Instant fechaHasta;

        try {
            fechaDesde = Instant.parse(desde);
            fechaHasta = Instant.parse(hasta);
        } catch (Exception e) {
            throw conflicto("RANGO_FECHAS_INVALIDO");
        }

        if (fechaHasta.isBefore(fechaDesde)) {
            throw conflicto("RANGO_FECHAS_INVALIDO");
        }

        Restaurante restaurante
                = ticketFinderService.obtenerRestaurantePorCodigo(codigoRestaurante);

        Page<Ticket> tickets
                = ticketRepository.buscarTiemposPreparacionPorRestauranteYRango(
                        restaurante.getIdRestaurante(),
                        fechaDesde,
                        fechaHasta,
                        PageRequest.of(page, size)
                );

        return tickets
                .stream()
                .map(ticketMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public TicketResponseDTO anularTicket(
            String codigoTicket,
            String motivo
    ) {
        Ticket ticket = ticketFinderService.obtenerTicketPorCodigo(codigoTicket);

        Ticket ticketActualizado
                = ticketEstadoWorkflowService.cambiarAAnulado(ticket, motivo);

        return ticketResponseFactory.construir(ticketActualizado, false);
    }

    private ResponseStatusException conflicto(String mensaje) {
        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}
