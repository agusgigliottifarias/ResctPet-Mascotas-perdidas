package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.Pedido;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntregaRepository extends JpaRepository<Entrega, UUID> {

    @Query("""
            SELECT e
            FROM Entrega e
            WHERE e.idPedido = :idPedido
            """)
    Optional<Entrega> findByIdPedido(UUID idPedido);

    @Query("""
            SELECT e
            FROM Entrega e
            WHERE e.repartidor.codigo = :codigoRepartidor
            """)
    List<Entrega> findByRepartidor_Codigo(
            String codigoRepartidor
    );

    @Query("""
            SELECT e
            FROM Entrega e
            WHERE e.codigo = :codigo
            """)
    Optional<Entrega> findByCodigo(String codigo);

    @Query("""
            SELECT e
            FROM Entrega e, Pedido p
            WHERE p.idPedido = e.idPedido
            AND e.estado = :estado
            AND e.fechaHoraEntregaReal IS NOT NULL
            AND p.fechaCreacion BETWEEN :desde AND :hasta
            """)
    List<Entrega> findEntregadasParaMetricas(
            EstadoEntrega estado,
            Instant desde,
            Instant hasta
    );

    @Query("""
            SELECT e
            FROM Entrega e, Pedido p
            WHERE p.idPedido = e.idPedido
            AND e.estado = :estado
            AND e.fechaHoraEntregaReal IS NOT NULL
            AND e.fechaHoraEntregaReal BETWEEN :desde AND :hasta
            AND (
                :zona IS NULL
                OR :zona = ''
                OR LOWER(p.restaurante.ciudad) = LOWER(:zona)
            )
            """)
    List<Entrega> findEntregadasParaRanking(
            EstadoEntrega estado,
            Instant desde,
            Instant hasta,
            String zona
    );

    @Query("""
        SELECT p
        FROM Entrega e, Pedido p
        JOIN FETCH p.restaurante r
        WHERE p.idPedido = e.idPedido
        AND e.estado = :estado
        AND e.fechaHoraEntregaReal IS NOT NULL
        AND e.fechaHoraEntregaReal BETWEEN :desde AND :hasta
        AND (
            :zona IS NULL
            OR :zona = ''
            OR LOWER(r.ciudad) = LOWER(:zona)
        )
        """)
    List<Pedido> findPedidosEntregadosParaRankingRestaurantes(
            EstadoEntrega estado,
            Instant desde,
            Instant hasta,
            String zona
    );

}
