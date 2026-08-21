package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoTicket;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.Instant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    @Query("""
            SELECT t
            FROM Ticket t
            WHERE t.idPedido = :idPedido
            """)
    Optional<Ticket> findByIdPedido(UUID idPedido);

    @Query("""
            SELECT t
            FROM Ticket t
            WHERE t.estado = :estado
            """)
    List<Ticket> findByEstado(EstadoTicket estado);

    @Query("""
            SELECT t
            FROM Ticket t
            WHERE t.estado IN :estados
            """)
    List<Ticket> findByEstadoIn(List<EstadoTicket> estados);

    @Query("""
            SELECT t
            FROM Ticket t
            WHERE t.codigo = :codigo
            """)
    Optional<Ticket> findByCodigo(String codigo);

    @Query("""
        SELECT t
        FROM Ticket t
        WHERE t.codigo = :codigoTicket
        AND t.idRestaurante = :idRestaurante
        """)
    Optional<Ticket> buscarPorTicketYRestaurante(
            String codigoTicket,
            UUID idRestaurante
    );

    @Query("""
        SELECT t
        FROM Ticket t
        WHERE t.idRestaurante = :idRestaurante
        AND t.finPreparacion IS NOT NULL
        AND t.duracionPreparacionSegundos IS NOT NULL
        AND t.anuladoEn IS NULL
        AND t.finPreparacion BETWEEN :desde AND :hasta
        ORDER BY t.finPreparacion DESC
        """)
    Page<Ticket> buscarTiemposPreparacionPorRestauranteYRango(
            UUID idRestaurante,
            Instant desde,
            Instant hasta,
            Pageable pageable
    );

    @Query("""
            SELECT COUNT(t)
            FROM Ticket t
            WHERE t.idRestaurante = :idRestaurante
            AND t.estado IN :estados
            """)
    int contarTicketsPorRestauranteYEstados(
            UUID idRestaurante,
            List<EstadoTicket> estados
    );

}
