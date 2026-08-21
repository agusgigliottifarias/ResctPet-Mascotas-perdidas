package unpsjb.labprog.backend.business;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Repartidor;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.EstadoRepartidor;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.RepartidorRepository;

@Service
@RequiredArgsConstructor
public class SeleccionRepartidorService {

    private final RepartidorRepository repartidorRepository;
    private final EntregaRepository entregaRepository;

    public Repartidor seleccionar() {

        List<Repartidor> repartidores = repartidorRepository.findAll();

        Repartidor mejorRepartidor = null;
        double mejorPuntaje = Double.MAX_VALUE;

        for (Repartidor repartidor : repartidores) {

            if (repartidor.getEstado() == EstadoRepartidor.EN_LINEA) {

                double puntaje = calcularPuntaje(repartidor);

                if (puntaje < mejorPuntaje) {
                    mejorPuntaje = puntaje;
                    mejorRepartidor = repartidor;
                }
            }
        }

        if (mejorRepartidor == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - NO_HAY_REPARTIDORES_DISPONIBLES"
            );
        }

        return mejorRepartidor;
    }

    private double calcularPuntaje(Repartidor repartidor) {

        List<Entrega> entregas
                = entregaRepository.findByRepartidor_Codigo(
                        repartidor.getCodigo()
                );

        int entregasHoy = 0;
        int entregasTotales = 0;

        Instant ultimaEntrega = null;
        Instant ahora = Instant.now();
        Instant inicioHoy = ahora.minus(Duration.ofHours(24));

        for (Entrega entrega : entregas) {

            if (entrega.getEstado() == EstadoEntrega.ENTREGADA) {

                entregasTotales++;

                if (entrega.getFechaHoraEntregaReal() != null) {

                    if (entrega.getFechaHoraEntregaReal().isAfter(inicioHoy)) {
                        entregasHoy++;
                    }

                    if (ultimaEntrega == null
                            || entrega.getFechaHoraEntregaReal().isAfter(ultimaEntrega)) {
                        ultimaEntrega = entrega.getFechaHoraEntregaReal();
                    }
                }
            }
        }

        long minutosSinPedido = 1440;

        if (ultimaEntrega != null) {
            minutosSinPedido
                    = Duration.between(ultimaEntrega, ahora).toMinutes();
        }

        double penalizacionPorEntregasHoy = entregasHoy * 10;
        double penalizacionPorHistorial = entregasTotales * 2;
        double beneficioPorEspera = Math.min(minutosSinPedido / 60.0, 20);

        double calificacion = repartidor.getCalificacionPromedio() == null
                ? 0.0
                : repartidor.getCalificacionPromedio();

        double beneficioPorCalificacion = calificacion * 2;

        return penalizacionPorEntregasHoy
                + penalizacionPorHistorial
                - beneficioPorEspera
                - beneficioPorCalificacion;
    }

    public Repartidor seleccionarExcluyendo(
            String codigoRepartidorExcluido
    ) {

        List<Repartidor> repartidores
                = repartidorRepository.findAll();

        Repartidor mejorRepartidor = null;
        double mejorPuntaje = Double.MAX_VALUE;

        for (Repartidor repartidor : repartidores) {

            if (repartidor.getCodigo().equals(codigoRepartidorExcluido)) {
                continue;
            }

            if (repartidor.getEstado() == EstadoRepartidor.EN_LINEA) {

                double puntaje = calcularPuntaje(repartidor);

                if (puntaje < mejorPuntaje) {
                    mejorPuntaje = puntaje;
                    mejorRepartidor = repartidor;
                }
            }
        }

        if (mejorRepartidor == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - NO_HAY_REPARTIDORES_DISPONIBLES"
            );
        }

        return mejorRepartidor;
    }
}
