package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.EventoTrazabilidad;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;
import unpsjb.labprog.backend.model.event.EntregaEntregadaEvent;

@Service
@RequiredArgsConstructor
public class PedidoEventoService {

    private final TrazabilidadService trazabilidadService;

    public void publicarEventoEntregaEntregada(
            Entrega entrega,
            Pedido pedido
    ) {

        EntregaEntregadaEvent evento =
                new EntregaEntregadaEvent(
                        entrega.getCodigo(),
                        pedido.getCodigo(),
                        entrega.getRepartidor().getCodigo()
                );

        EventoTrazabilidad trazabilidad = new EventoTrazabilidad();

        trazabilidad.setEventId("TRAZ-" + evento.getCodigoPedido() + "-ENTREGA-ENTREGADA");
        trazabilidad.setEventType("EntregaEntregada");
        trazabilidad.setIdPedido(evento.getCodigoPedido());
        trazabilidad.setIdEntrega(evento.getCodigoEntrega());
        trazabilidad.setTimestamp(evento.getOcurridoEn());
        trazabilidad.setActorTipo(ActorTrazabilidad.REPARTIDOR);
        trazabilidad.setPayload(
                "{ \"idEntrega\": \"" + evento.getCodigoEntrega()
                        + "\", \"idRepartidor\": \"" + evento.getCodigoRepartidor()
                        + "\" }"
        );

        trazabilidadService.registrarEvento(trazabilidad);

        System.out.println(
                "EVENTO EntregaEntregada publicado -> "
                        + "entrega=" + evento.getCodigoEntrega()
                        + ", pedido=" + evento.getCodigoPedido()
                        + ", repartidor=" + evento.getCodigoRepartidor()
                        + ", ocurridoEn=" + evento.getOcurridoEn()
        );
    }
}