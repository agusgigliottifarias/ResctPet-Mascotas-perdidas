package app.presenter;

import app.Response;
import app.business.PublicacionService;
import app.model.dto.BusquedaPublicacionRequest;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionPresenter {

    private final PublicacionService publicacionService;

    public PublicacionPresenter(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    // Endpoint genérico de creación
    @PostMapping
    public ResponseEntity<Response> crearPublicacion(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        return procesarGuardado(request, authentication);
    }

    // Endpoint específico para mascotas perdidas
    @PostMapping("/perdidas")
    public ResponseEntity<Response> crearPublicacionPerdida(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(TipoPublicacion.PERDIDA);
        return procesarGuardado(request, authentication);
    }

    // Endpoint específico para mascotas encontradas
    @PostMapping("/encontradas")
    public ResponseEntity<Response> crearPublicacionEncontrada(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(TipoPublicacion.ENCONTRADA);
        return procesarGuardado(request, authentication);
    }

    // Endpoint para buscar publicaciones por criterios
    @GetMapping("/buscar")
    public ResponseEntity<Response> buscarPublicaciones(
            @RequestParam(required = false) Especie especie,
            @RequestParam(required = false) TipoPublicacion tipoPublicacion,
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String raza,
            @RequestParam(required = false) String caracteristicas) {

        try {
            BusquedaPublicacionRequest request = new BusquedaPublicacionRequest();

            request.setEspecie(especie);
            request.setTipoPublicacion(tipoPublicacion);
            request.setFecha(fecha);
            request.setRaza(raza);
            request.setCaracteristicas(caracteristicas);

            List<PublicacionResponse> resultados =
                    publicacionService.buscar(request);

            // Manejo de búsqueda sin resultados
            if (resultados.isEmpty()) {
                return Response.response(
                        HttpStatus.OK,
                        "No se encontraron publicaciones que coincidan con los criterios de búsqueda",
                        resultados
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Publicaciones encontradas exitosamente",
                    resultados
            );

        } catch (IllegalArgumentException e) {
            return Response.response(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {
            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error al buscar publicaciones",
                    null
            );
        }
    }

    // Endpoint para consultar una publicación por ID
    @GetMapping("/{id}")
    public ResponseEntity<Response> consultarPublicacion(
            @PathVariable Long id) {

        try {
            PublicacionResponse respuesta =
                    publicacionService.consultar(id);

            return Response.response(
                    HttpStatus.OK,
                    "Publicación consultada exitosamente",
                    respuesta
            );

        } catch (IllegalArgumentException e) {
            return Response.response(
                    HttpStatus.NOT_FOUND,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {
            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error al consultar la publicación",
                    null
            );
        }
    }

    // Método auxiliar para centralizar el manejo de respuestas al guardar
    private ResponseEntity<Response> procesarGuardado(
            PublicacionRequest request,
            Authentication authentication) {

        try {
            PublicacionResponse respuesta =
                    publicacionService.guardar(request, authentication);

            return Response.response(
                    HttpStatus.CREATED,
                    "Publicación creada y fotografía asociada exitosamente",
                    respuesta
            );

        } catch (IllegalArgumentException e) {
            return Response.response(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {
            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error al crear la publicación",
                    null
            );
        }
    }
}