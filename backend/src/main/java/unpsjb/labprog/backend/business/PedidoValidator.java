package unpsjb.labprog.backend.business;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;

import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.PagoRepository;
import unpsjb.labprog.backend.model.enums.EstadoPago;

import java.util.UUID;

@Component
public class PedidoValidator {

    private final PagoRepository pagoRepository;

    public PedidoValidator(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public void validarPedidoParaPago(Pedido pedido) {

        if (pedido.getEstado() != EstadoPedido.CREACION_PENDIENTE) {
            throw conflicto("ESTADO_PEDIDO_NO_PERMITE_APROBACION");
        }
    }

    public void validarPagoDuplicado(UUID idPedido) {

        if (pagoRepository.existsByIdPedidoAndEstado(
                idPedido,
                EstadoPago.CAPTURADO
        )) {

            throw conflicto("PAGO_DUPLICADO_POR_PEDIDO");
        }
    }

    public void validarPedidoPerteneceAlConsumidor(
            Pedido pedido,
            String emailConsumidor
    ) {

        if (!pedido.getEmailConsumidor().equals(emailConsumidor)) {
            throw conflicto("PEDIDO_NO_PERTENECE_AL_CONSUMIDOR");
        }
    }

    public void validarRepartidorAsignado(
            Entrega entrega,
            String codigoRepartidor
    ) {

        if (entrega.getRepartidor() == null
                || !entrega.getRepartidor()
                        .getCodigo()
                        .equals(codigoRepartidor)) {

            throw conflicto("EL_REPARTIDOR_NO_ES_EL_ASIGNADO");
        }
    }

    public void validarConsistencia(
            Ticket ticket,
            Entrega entrega
    ) {

        if (ticket == null || entrega == null) {
            return;
        }

        if (entrega.getEstado() == EstadoEntrega.EN_TRAYECTO
                && ticket.getEstado() == EstadoTicket.ACEPTADO) {

            throw conflicto("ESTADO_INCONSISTENTE");
        }
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }

    public void validarPedidoPerteneceARestaurante(
            Pedido pedido,
            Restaurante restaurante
    ) {

        if (!pedido.getRestaurante()
                .getCodigo()
                .equals(restaurante.getCodigo())) {

            throw conflicto(
                    "PEDIDO_NO_PERTENECE_AL_RESTAURANTE"
            );
        }
    }

    public void validarPedidoAceptable(
            Pedido pedido
    ) {

        if (pedido.getEstado() != EstadoPedido.APROBADO) {

            throw conflicto(
                    "ESTADO_PEDIDO_NO_PERMITE_ACEPTACION"
            );
        }
    }

    public void validarTicketAceptable(
            Ticket ticket
    ) {

        if (ticket.getEstado() == EstadoTicket.EN_PREPARACION) {

            throw conflicto(
                    "PEDIDO_YA_ACEPTADO"
            );
        }

        if (ticket.getEstado() != EstadoTicket.ACEPTADO) {

            throw conflicto(
                    "ESTADO_TICKET_NO_PERMITE_ACEPTACION"
            );
        }
    }

    public void validarRestauranteDisponible(
            Restaurante restaurante
    ) {

        if (!restaurante.getAceptaPedidos()) {

            throw conflicto(
                    "RESTAURANTE_NO_ACEPTA_PEDIDOS"
            );
        }
    }

    public void validarTiempoCompromiso(
            Instant listoPara
    ) {

        if (listoPara == null
                || listoPara.isBefore(Instant.now())) {

            throw conflicto(
                    "TIEMPO_COMPROMISO_INVALIDO"
            );
        }
    }

    public void validarDireccionDentroDelRango(
            Restaurante restaurante,
            List<Double> ubicacion
    ) {

        if (ubicacion == null || ubicacion.size() < 2) {
            throw conflicto("DIRECCION_SIN_UBICACION");
        }

        double distanciaKm = calcularDistanciaKm(
                restaurante.getLatitud(),
                restaurante.getLongitud(),
                ubicacion.get(0),
                ubicacion.get(1)
        );

        if (distanciaKm > 5) {
            throw conflicto("DIRECCION_FUERA_DE_RANGO");
        }
    }

    private double calcularDistanciaKm(
            double lat1,
            double lon1,
            double lat2,
            double lon2
    ) {
        final int RADIO_TIERRA_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a
                = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2)
                * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
        );

        return RADIO_TIERRA_KM * c;
    }

}
