package unpsjb.labprog.backend.presenter;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.business.TrazabilidadService;
import unpsjb.labprog.backend.model.EventoTrazabilidad;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class TrazabilidadPresenter {

    @Autowired
    private TrazabilidadService trazabilidadService;

    @PostMapping("/trazabilidad/eventos")
    public Map<String, Object> registrarEvento(
            @RequestBody EventoTrazabilidad evento) {

        Map<String, Object> data = trazabilidadService.registrarEvento(evento);

        Map<String, Object> response = new HashMap<>();
        response.put("status_text", "OK");
        response.put("status_code", 200);
        response.put("data", data);

        return response;
    }

    @GetMapping("/pedidos/{idPedido}/trazabilidad")
    public Map<String, Object> obtenerTrazabilidad(
            @PathVariable String idPedido,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) ActorTrazabilidad actorTipo,
            @RequestParam(required = false) Instant desde,
            @RequestParam(required = false) Instant hasta) {

        var eventos = trazabilidadService.buscarTimeline(
                idPedido,
                eventType,
                actorTipo,
                desde,
                hasta,
                PageRequest.of(page, size));

        Map<String, Object> data = new HashMap<>();
        data.put("idPedido", idPedido);
        data.put("timeline", eventos.getContent());
        data.put("page", eventos.getNumber());
        data.put("size", eventos.getSize());
        data.put("totalElements", eventos.getTotalElements());
        data.put("totalPages", eventos.getTotalPages());
        data.put("incompleto", false);

        Map<String, Object> response = new HashMap<>();
        response.put("status_text", "OK");
        response.put("status_code", 200);
        response.put("data", data);

        return response;
    }
}