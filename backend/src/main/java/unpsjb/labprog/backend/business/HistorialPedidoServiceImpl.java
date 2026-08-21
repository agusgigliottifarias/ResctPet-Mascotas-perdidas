package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.dto.HistorialPedidoDTO;
import unpsjb.labprog.backend.repository.HistorialPedidoRepository;
import unpsjb.labprog.backend.model.HistorialPedido;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.Entrega;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HistorialPedidoServiceImpl
        implements HistorialPedidoService {

    private final HistorialPedidoRepository historialPedidoRepository;
    private final HistorialPedidoMapper historialPedidoMapper;
    private final PedidoFinder pedidoFinder;

    @Override
    public Map<String, Object> obtenerHistorial(
            String emailConsumidor,
            String estado,
            Instant desde,
            Instant hasta,
            String codigoRestaurante,
            int page,
            int size
    ) {

        validarFiltros(
                estado,
                desde,
                hasta
        );

       List<HistorialPedidoDTO> todos =
        buscarHistorial(
                emailConsumidor,
                normalizar(estado),
                desde,
                hasta,
                normalizar(codigoRestaurante)
        )
        .stream()
        .map(
                historialPedidoMapper::toDTO
        )
        .toList();

        int totalElements =
                todos.size();

        int desdeIndice =
                Math.min(
                        page * size,
                        totalElements
                );

        int hastaIndice =
                Math.min(
                        desdeIndice + size,
                        totalElements
                );

        List<HistorialPedidoDTO> pagina =
                todos.subList(
                        desdeIndice,
                        hastaIndice
                );

        int totalPages =
                (int) Math.ceil(
                        (double) totalElements / size
                );

        return Map.of(
                "page", Map.of(
                        "number", page,
                        "size", size,
                        "totalElements", totalElements,
                        "totalPages", totalPages
                ),
                "orders", pagina
        );
    }

    private List<HistorialPedido> buscarHistorial(
        String emailConsumidor,
        String estado,
        Instant desde,
        Instant hasta,
        String codigoRestaurante
) {

    if (desde == null && hasta == null) {

        return historialPedidoRepository
                .buscarHistorialSinFechas(
                        emailConsumidor,
                        estado,
                        codigoRestaurante
                );
    }

    Instant desdeFinal =
            desde != null
                    ? desde
                    : Instant.EPOCH;

    Instant hastaFinal =
            hasta != null
                    ? hasta
                    : Instant.now();

    return historialPedidoRepository
            .buscarHistorialConFechas(
                    emailConsumidor,
                    estado,
                    codigoRestaurante,
                    desdeFinal,
                    hastaFinal
            );
}

    private void validarFiltros(
            String estado,
            Instant desde,
            Instant hasta
    ) {

        if (
                desde != null
                && hasta != null
                && desde.isAfter(hasta)
        ) {

            throw new RuntimeException(
                    "CONFLICTO - RANGO_FECHAS_INVALIDO"
            );
        }

        String estadoNormalizado =
                normalizar(
                        estado
                );

        if (
                estadoNormalizado != null
                && !estadoValido(
                        estadoNormalizado
                )
        ) {

            throw new RuntimeException(
                    "CONFLICTO - FILTRO_ESTADO_INVALIDO"
            );
        }
    }

  private boolean estadoValido(
        String estado
) {

    return List.of(
            "CREACION_PENDIENTE",
            "PAGO_CONFIRMADO",
            "APROBADO",
            "EN_CAMINO",
            "RECHAZADO",
            "CANCELADO",
            "ENTREGADO",
            "RECIBIDO"
    ).contains(estado);
}

    private String normalizar(
            String valor
    ) {

        if (
                valor == null
                || valor.isBlank()
        ) {

            return null;
        }

        return valor
                .trim()
                .toUpperCase();
    }

@Override
public void actualizarHistorialPedido(Pedido pedido) {

 {

    HistorialPedido historial =
            historialPedidoRepository
                    .findByCodigoPedido(
                            pedido.getCodigo()
                    )
                    .orElseGet(() -> {

                        HistorialPedido nuevo =
                                new HistorialPedido();

                        nuevo.setCodigoPedido(
                                pedido.getCodigo()
                        );

                        nuevo.setEmailConsumidor(
                                pedido.getEmailConsumidor()
                        );

                        nuevo.setTotal(
                                pedido.getTotal()
                        );

                        nuevo.setCreadoEn(
                                Instant.now()
                        );

                        nuevo.setCodigoRestaurante(
                                pedido.getRestaurante()
                                        .getCodigo()
                        );

                        nuevo.setNombreRestaurante(
                                pedido.getRestaurante()
                                        .getNombre()
                        );

                        return nuevo;
                    });

    historial.setEstado(
            pedido.getEstado().name()
    );

    Ticket ticket =
            pedidoFinder.buscarTicketOpcional(
                    pedido.getIdPedido()
            );

    if (ticket != null) {

        historial.setEstadoTicket(
                ticket.getEstado().name()
        );
    }

    Entrega entrega =
            pedidoFinder.buscarEntregaOpcional(
                    pedido.getIdPedido()
            );

    if (entrega != null) {

        historial.setEstadoEntrega(
                entrega.getEstado().name()
        );
    }

    historial.setFechaActualizacion(
            Instant.now()
    );

    historialPedidoRepository.save(
            historial
    );
    }
  }
}