package app.presenter;

import app.Response;
import app.business.PublicacionService;
import app.model.dto.BusquedaPublicacionRequest;
import app.model.dto.PublicacionPageResponse;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionPresenter {

    private final PublicacionService publicacionService;

    public PublicacionPresenter(
            PublicacionService publicacionService) {

        this.publicacionService = publicacionService;
    }

    @PostMapping
    public ResponseEntity crearPublicacion(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        return procesarGuardado(
                request,
                authentication);
    }

    @PostMapping("/perdidas")
    public ResponseEntity crearPublicacionPerdida(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(
                TipoPublicacion.PERDIDA);

        return procesarGuardado(
                request,
                authentication);
    }

    @PostMapping("/encontradas")
    public ResponseEntity crearPublicacionEncontrada(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(
                TipoPublicacion.ENCONTRADA);

        return procesarGuardado(
                request,
                authentication);
    }

    /**
     * T - 5.1.4:
     * Endpoint para validar la publicación seleccionada
     * y ejecutar la búsqueda.
     */
    @GetMapping("/{id}/validar-y-buscar")
    public ResponseEntity buscarPorPublicacionSeleccionada(
            @PathVariable Long id,
            @RequestParam(required = false) Double radioKm) {

        try {

            List resultados =
                    publicacionService
                            .buscarPorPublicacionSeleccionada(
                                    id,
                                    radioKm);

            if (resultados.isEmpty()) {

                return Response.response(
                        HttpStatus.OK,
                        "La publicación seleccionada es válida, pero no se encontraron coincidencias para la búsqueda",
                        resultados
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Búsqueda realizada exitosamente a partir de la publicación seleccionada",
                    resultados
            );

        } catch (IllegalArgumentException e) {

            return Response.response(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );

        } catch (IllegalStateException e) {

            return Response.response(
                    HttpStatus.CONFLICT,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {

            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error al validar la publicación seleccionada y realizar la búsqueda",
                    null
            );
        }
    }

    /**
     * Búsqueda general de publicaciones con paginación.
     *
     * pagina:
     * número de página comenzando desde 0.
     *
     * tamanio:
     * cantidad máxima de publicaciones por página.
     */
    @GetMapping("/buscar")
    public ResponseEntity buscarPublicaciones(
            @RequestParam(required = false) Especie especie,
            @RequestParam(required = false) TipoPublicacion tipoPublicacion,
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String raza,
            @RequestParam(required = false) String caracteristicas,
            @RequestParam(required = false) Double latitud,
            @RequestParam(required = false) Double longitud,
            @RequestParam(required = false) Double radioKm,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {

        try {

            BusquedaPublicacionRequest request =
                    new BusquedaPublicacionRequest();

            request.setEspecie(especie);
            request.setTipoPublicacion(tipoPublicacion);
            request.setFecha(fecha);
            request.setRaza(raza);
            request.setCaracteristicas(caracteristicas);

            request.setLatitud(latitud);
            request.setLongitud(longitud);
            request.setRadioKm(radioKm);

            PublicacionPageResponse resultados =
                    publicacionService.buscarPaginado(
                            request,
                            pagina,
                            tamanio);

            if (resultados.getContenido().isEmpty()) {

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

    @GetMapping("/especie/{especie}")
    public ResponseEntity obtenerPorEspecie(
            @PathVariable Especie especie) {

        try {

            List resultados =
                    publicacionService
                            .buscarPorEspecie(especie);

            if (resultados.isEmpty()) {

                return Response.response(
                        HttpStatus.OK,
                        "No se encontraron publicaciones para la especie "
                                + especie,
                        resultados
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Publicaciones encontradas exitosamente para la especie "
                            + especie,
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
                    "Ocurrió un error al filtrar por especie",
                    null
            );
        }
    }

    /**
     * Endpoint de búsqueda por cercanía geográfica.
     */
    @GetMapping("/cercania")
    public ResponseEntity obtenerPorCercania(
            @RequestParam Double latitud,
            @RequestParam Double longitud,
            @RequestParam(required = false) Double radioKm) {

        try {

            List resultados =
                    publicacionService.buscarPorCercania(
                            latitud,
                            longitud,
                            radioKm);

            if (resultados.isEmpty()) {

                return Response.response(
                        HttpStatus.OK,
                        "No se encontraron publicaciones cercanas en el radio especificado",
                        resultados
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Publicaciones cercanas encontradas exitosamente",
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
                    "Ocurrió un error al buscar publicaciones por cercanía",
                    null
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity consultarPublicacion(
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

    private ResponseEntity procesarGuardado(
            PublicacionRequest request,
            Authentication authentication) {

        try {

            PublicacionResponse respuesta =
                    publicacionService.guardar(
                            request,
                            authentication);

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