package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.PedidoService;
import unpsjb.labprog.backend.model.dto.PedidoRequestDTO;
import unpsjb.labprog.backend.model.dto.PedidoResponseDTO;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoPresenter {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Object> crear(
            @RequestBody PedidoRequestDTO request
    ) {
        PedidoResponseDTO nuevoPedido
                = pedidoService.crearPedido(request);

        return Response.ok(
                nuevoPedido,
                "CREADO"
        );
    }

    @GetMapping("/consumidor/{codigoPedido}")
    public ResponseEntity<Object> consultar(
            @PathVariable String codigoPedido,
            @RequestParam("emailConsumidor") String emailConsumidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.getPedido(
                        codigoPedido,
                        emailConsumidor
                );

        return Response.ok(
                pedido,
                pedido.getStatus_text()
        );
    }

    @PostMapping("/{codigoPedido}/cancelar")
    public ResponseEntity<Object> cancelar(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("emailConsumidor") String emailConsumidor,
            @RequestParam("motivoCancelacion") String motivoCancelacion,
            @RequestParam(value = "forzarErrorReembolso", required = false, defaultValue = "false") boolean forzarErrorReembolso
    ) {
        PedidoResponseDTO pedidoCancelado
                = pedidoService.cancelarPedido(
                        codigoPedido,
                        emailConsumidor,
                        motivoCancelacion,
                        forzarErrorReembolso
                );

        return Response.ok(
                pedidoCancelado,
                "OK"
        );
    }

    @GetMapping("/para-repartir")
    public ResponseEntity<Object> listarParaRepartir() {
        return Response.ok(
                pedidoService.listarPedidosParaRepartir(),
                "LISTADO_PARA_REPARTIR"
        );
    }

    @GetMapping("/repartidor/{codigoRepartidor}")
    public ResponseEntity<Object> pedidosDelRepartidor(
            @PathVariable String codigoRepartidor
    ) {
        return Response.ok(
                pedidoService.listarPedidosDeRepartidor(codigoRepartidor),
                "PEDIDOS_REPARTIDOR"
        );
    }

    @PostMapping("/{codigoPedido}/asignar-repartidor")
    public ResponseEntity<Object> asignarRepartidor(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam(value = "codigoRepartidor", required = false) String codigoRepartidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.asignarRepartidor(
                        codigoPedido,
                        codigoRepartidor
                );

        return Response.ok(
                pedido,
                "REPARTIDOR_ASIGNADO"
        );
    }

    @PostMapping("/{codigoPedido}/aceptar-entrega")
    public ResponseEntity<Object> aceptarEntrega(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("codigoRepartidor") String codigoRepartidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.aceptarEntrega(
                        codigoPedido,
                        codigoRepartidor
                );

        return Response.ok(
                pedido,
                "ENTREGA_ACEPTADA"
        );
    }

    @PostMapping("/{codigoPedido}/rechazar-entrega")
    public ResponseEntity<Object> rechazarEntrega(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("codigoRepartidor") String codigoRepartidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.rechazarEntrega(
                        codigoPedido,
                        codigoRepartidor
                );

        return Response.ok(
                pedido,
                "ENTREGA_RECHAZADA"
        );
    }

    @PostMapping("/{codigoPedido}/tomar")
    public ResponseEntity<Object> tomarPedido(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("codigoRepartidor") String codigoRepartidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.tomarPedido(
                        codigoPedido,
                        codigoRepartidor
                );

        return Response.ok(
                pedido,
                "PEDIDO_EN_CAMINO"
        );
    }

    @PostMapping("/{codigoPedido}/retirar")
    public ResponseEntity<Object> retirarPedido(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("codigoRepartidor") String codigoRepartidor
    ) {

        PedidoResponseDTO pedido
                = pedidoService.retirarPedido(
                        codigoPedido,
                        codigoRepartidor
                );

        return Response.ok(
                pedido,
                "PEDIDO_RETIRADO"
        );
    }

    @PostMapping("/{codigoPedido}/entregar")
    public ResponseEntity<Object> entregarPedido(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("codigoRepartidor") String codigoRepartidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.entregarPedido(
                        codigoPedido,
                        codigoRepartidor
                );

        return Response.ok(
                pedido,
                "PEDIDO_ENTREGADO"
        );
    }

    @PutMapping("/{codigoPedido}/confirmar-recepcion")
    public ResponseEntity<Object> confirmarRecepcion(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("emailConsumidor") String emailConsumidor
    ) {
        PedidoResponseDTO pedido
                = pedidoService.confirmarRecepcion(
                        codigoPedido,
                        emailConsumidor
                );

        return Response.ok(
                pedido,
                "PEDIDO_RECIBIDO"
        );
    }

    @PostMapping("/{codigoPedido}/calificar-repartidor")
    public ResponseEntity<Object> calificarRepartidor(
            @PathVariable("codigoPedido") String codigoPedido,
            @RequestParam("emailConsumidor") String emailConsumidor,
            @RequestParam("calificacion") Integer calificacion
    ) {

        PedidoResponseDTO pedido
                = pedidoService.calificarRepartidor(
                        codigoPedido,
                        emailConsumidor,
                        calificacion
                );

        return Response.ok(
                pedido,
                "REPARTIDOR_CALIFICADO"
        );
    }

    @PutMapping("/{codigoPedido}/aceptar")
    public ResponseEntity<Object> aceptarPedido(
            @PathVariable String codigoPedido,
            @RequestParam(required = false) String codigoRestaurante,
            @RequestParam(required = false) String listoPara
    ) {
        PedidoResponseDTO pedido
                = pedidoService.aceptarPedidoRestaurante(
                        codigoPedido,
                        codigoRestaurante,
                        listoPara
                );

        return Response.ok(pedido, "OK");
    }

    @GetMapping("/pendientes")
    public ResponseEntity<Object> listarPendientes() {
        return Response.ok(
                pedidoService.listarPedidosPendientes(),
                "LISTADO_PENDIENTES"
        );
    }

    @PutMapping("/{codigoPedido}/iniciar-preparacion")
    public ResponseEntity<Object> iniciarPreparacion(
            @PathVariable("codigoPedido") String codigoPedido
    ) {
        PedidoResponseDTO pedido
                = pedidoService.iniciarPreparacion(codigoPedido);

        return Response.ok(
                pedido,
                "EN_PREPARACION"
        );
    }

    @PutMapping("/{codigoPedido}/marcar-listo")
    public ResponseEntity<Object> marcarListo(
            @PathVariable("codigoPedido") String codigoPedido
    ) {
        PedidoResponseDTO pedido
                = pedidoService.marcarPedidoListo(codigoPedido);

        return Response.ok(
                pedido,
                "LISTO"
        );
    }

    @GetMapping("/admin")
    public ResponseEntity<Object> listarPedidosAdmin() {
        return Response.ok(
                pedidoService.listarPedidosAdmin(),
                "LISTADO_ADMIN_PEDIDOS"
        );
    }

}
