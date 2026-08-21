package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.enums.EstadoPago;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, UUID> {

    @Query("""
            SELECT p
            FROM Pago p
            WHERE p.codigo = :codigo
            """)
    Optional<Pago> findByCodigo(
            String codigo
    );

    @Query("""
            SELECT p
            FROM Pago p
            WHERE p.idPedido = :idPedido
            """)
    Optional<Pago> findByIdPedido(
            UUID idPedido
    );

    @Query("""
            SELECT COUNT(p) > 0
            FROM Pago p
            WHERE p.idPedido = :idPedido
              AND p.estado = :estado
            """)
    boolean existsByIdPedidoAndEstado(
            UUID idPedido,
            EstadoPago estado
    );

    @Query("""
        SELECT COUNT(p) > 0
        FROM Pago p
        WHERE p.idPedido = :idPedido
          AND p.estado IN :estados
        """)
    boolean existsByIdPedidoAndEstadoIn(
            UUID idPedido,
            List<EstadoPago> estados
    );

    @Query("""
        SELECT p
        FROM Pago p
        WHERE p.idPedido = :idPedido
        ORDER BY p.fechaAutorizacion DESC
        """)
    List<Pago> findAllByIdPedidoOrderByFechaAutorizacionDesc(
            UUID idPedido
    );

    @Query("""
SELECT p
FROM Pago p, Pedido pedido
WHERE p.idPedido = pedido.idPedido
  AND p.fechaAutorizacion BETWEEN :desde AND :hasta
  AND (:moneda = 'ALL' OR p.monto.moneda = :moneda)
  AND (
        :incluirNoCapturados = true
        OR p.estado = unpsjb.labprog.backend.model.enums.EstadoPago.CAPTURADO
      )
  AND (
        :idRestaurante IS NULL
        OR :idRestaurante = ''
        OR pedido.restaurante.codigo = :idRestaurante
      )
  AND (
        :zona IS NULL
        OR :zona = ''
        OR pedido.restaurante.ciudad = :zona
      )
  AND (
        :idConsumidor IS NULL
        OR :idConsumidor = ''
        OR p.emailConsumidor = :idConsumidor
      )
ORDER BY p.monto.monto ASC
""")
    List<Pago> findPagosParaDistribucion(
            java.time.Instant desde,
            java.time.Instant hasta,
            String moneda,
            Boolean incluirNoCapturados,
            String idRestaurante,
            String zona,
            String idConsumidor
    );

    @Query("""
SELECT p
FROM Pago p
JOIN Pedido pedido ON p.idPedido = pedido.idPedido
WHERE p.estado = unpsjb.labprog.backend.model.enums.EstadoPago.CAPTURADO
  AND p.fechaAutorizacion BETWEEN :desde AND :hasta
  AND p.monto.moneda = :moneda
  AND (
        :idRestaurante IS NULL
        OR :idRestaurante = ''
        OR pedido.restaurante.codigo = :idRestaurante
      )
""")
    List<Pago> findPagosCapturadosParaResumenComisiones(
            java.time.Instant desde,
            java.time.Instant hasta,
            String moneda,
            String idRestaurante
    );
}
