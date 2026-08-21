package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.TicketResponseDTO;

import java.util.List;

public interface TicketService {

    Ticket obtenerPorPedido(String codigoPedido);

    Ticket obtenerPorRestauranteYTicket(String codigoRestaurante, String codigoTicket);

    Ticket marcarEnPreparacion(String codigoPedido);

    Ticket marcarEnPreparacion(String codigoRestaurante, String codigoTicket);

    Ticket marcarListo(String codigoPedido);

    Ticket marcarListo(String codigoRestaurante, String codigoTicket);

    Ticket crearTicketPrevioParaPedido(String codigoPedido);

    TicketResponseDTO obtenerRespuestaPorRestauranteYTicket(String codigoRestaurante, String codigoTicket);

    TicketResponseDTO marcarEnPreparacionRespuesta(String codigoRestaurante, String codigoTicket);

    TicketResponseDTO marcarListoRespuesta(String codigoRestaurante, String codigoTicket);

    TicketResponseDTO marcarEnPreparacionRespuestaPorPedido(String codigoPedido);

    TicketResponseDTO marcarListoRespuestaPorPedido(String codigoPedido);

    TicketResponseDTO anularTicket(String codigoTicket, String motivo);

    List<Ticket> obtenerTodos();

    List<TicketResponseDTO> consultarTiemposPreparacion(String codigoRestaurante, String desde, String hasta, int page, int size);
}