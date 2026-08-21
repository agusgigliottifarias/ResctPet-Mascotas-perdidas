package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.TicketRepository;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TicketEstadoWorkflowService {

    private final TicketRepository ticketRepository;
    private final TicketValidatorService ticketValidatorService;
    private final TicketEventoService ticketEventoService;
    private final TicketEntregaService ticketEntregaService;
    private final TicketPedidoService ticketPedidoService;
    private final TicketHistorialService ticketHistorialService;

    @Transactional
    public Ticket cambiarAEnPreparacion(Ticket ticket) {
        ticketValidatorService.validarPedidoAsociado(ticket);
        ticketValidatorService.validarTicketNoAnulado(ticket);

        if (ticket.getInicioPreparacion() != null) {
            return ticket;
        }

        ticketValidatorService.validarTransicionAEnPreparacion(ticket);

        Instant ahora = Instant.now();

        ticket.setEstadoAnterior(ticket.getEstado());
        ticket.setEstado(EstadoTicket.EN_PREPARACION);

        if (ticket.getInicioPreparacion() == null) {
            ticket.setInicioPreparacion(ahora);
        }

        actualizarAuditoriaCocina(ticket, ahora);

        Ticket ticketGuardado = guardarControlandoConcurrencia(ticket);

        ticketHistorialService.actualizarHistorial(ticketGuardado);

        return ticketGuardado;
    }

    @Transactional
    public Ticket cambiarAListo(Ticket ticket) {
        ticketValidatorService.validarPedidoAsociado(ticket);
        ticketValidatorService.validarTicketNoAnulado(ticket);

        if (ticket.getFinPreparacion() != null) {
            return ticket;
        }

        if (ticket.getInicioPreparacion() == null) {
            throw conflicto("INICIO_PREPARACION_INEXISTENTE");
        }

        ticketValidatorService.validarTransicionAListo(ticket);

        Instant ahora = Instant.now();

        if (ahora.isBefore(ticket.getInicioPreparacion())) {
            throw conflicto("ORDEN_TEMPORAL_INVALIDO");
        }

        long duracionSegundos
                = ahora.getEpochSecond()
                - ticket.getInicioPreparacion().getEpochSecond();

        ticket.setEstadoAnterior(ticket.getEstado());
        ticket.setEstado(EstadoTicket.LISTO);
        ticket.setFinPreparacion(ahora);
        ticket.setDuracionPreparacionSegundos(duracionSegundos);

        actualizarAuditoriaCocina(ticket, ahora);

        Ticket ticketGuardado = guardarControlandoConcurrencia(ticket);

        procesarTicketListo(ticketGuardado);

        return ticketGuardado;
    }

    @Transactional
    public Ticket cambiarAAnulado(
            Ticket ticket,
            String motivo
    ) {
        ticketValidatorService.validarPedidoAsociado(ticket);

        if (ticket.getEstado() != EstadoTicket.ACEPTADO
                && ticket.getEstado() != EstadoTicket.TOMADO
                && ticket.getEstado() != EstadoTicket.EN_PREPARACION) {
            throw conflicto("TRANSICION_TICKET_INVALIDA");
        }

        Instant ahora = Instant.now();

        ticket.setEstadoAnterior(ticket.getEstado());
        ticket.setEstado(EstadoTicket.ANULADO);
        ticket.setAnuladoEn(ahora);
        ticket.setDuracionPreparacionSegundos(null);

        actualizarAuditoriaCocina(ticket, ahora);

        ticket.setMotivo(motivo);

        ticketPedidoService.cancelarPedidoAsociado(ticket);
        ticketEntregaService.actualizarEntregaTicketAnulado(ticket);

        Ticket ticketGuardado = guardarControlandoConcurrencia(ticket);

        ticketHistorialService.actualizarHistorial(ticketGuardado);

        return ticketGuardado;
    }

    private void procesarTicketListo(Ticket ticket) {
        ticketEntregaService.actualizarEntregaTicketListo(ticket);
        ticketHistorialService.actualizarHistorial(ticket);
        ticketEventoService.publicarEventoTicketListo(ticket);
        ticketEventoService.publicarEventoTiempoPreparacionRegistrado(ticket);
    }

    private void actualizarAuditoriaCocina(
            Ticket ticket,
            Instant fecha
    ) {
        ticket.setFechaUltimaActualizacion(fecha);
        ticket.setActualizadoPor("COCINA");
    }

    private Ticket guardarControlandoConcurrencia(Ticket ticket) {
        try {
            return ticketRepository.saveAndFlush(ticket);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw conflicto("OPERACION_CONCURRENTE");
        }
    }

    private ResponseStatusException conflicto(String mensaje) {
        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}
