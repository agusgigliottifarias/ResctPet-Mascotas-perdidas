package unpsjb.labprog.backend.repository;

import unpsjb.labprog.backend.model.HistorialPedido;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HistorialPedidoRepository
        extends JpaRepository<HistorialPedido, UUID> {

    Optional<HistorialPedido> findByCodigoPedido(
            String codigoPedido
    );

    @Query("""
        SELECT h
        FROM HistorialPedido h
        WHERE h.emailConsumidor = :emailConsumidor

        AND (
            :estado IS NULL
            OR h.estado = :estado
        )

        AND (
            :codigoRestaurante IS NULL
            OR h.codigoRestaurante = :codigoRestaurante
        )

        ORDER BY h.creadoEn DESC
    """)
    List<HistorialPedido> buscarHistorialSinFechas(
            @Param("emailConsumidor")
            String emailConsumidor,

            @Param("estado")
            String estado,

            @Param("codigoRestaurante")
            String codigoRestaurante
    );

    @Query("""
        SELECT h
        FROM HistorialPedido h
        WHERE h.emailConsumidor = :emailConsumidor

        AND (
            :estado IS NULL
            OR h.estado = :estado
        )

        AND (
            :codigoRestaurante IS NULL
            OR h.codigoRestaurante = :codigoRestaurante
        )

        AND h.creadoEn >= :desde
        AND h.creadoEn <= :hasta

        ORDER BY h.creadoEn DESC
    """)
    List<HistorialPedido> buscarHistorialConFechas(
            @Param("emailConsumidor")
            String emailConsumidor,

            @Param("estado")
            String estado,

            @Param("codigoRestaurante")
            String codigoRestaurante,

            @Param("desde")
            Instant desde,

            @Param("hasta")
            Instant hasta
    );
}