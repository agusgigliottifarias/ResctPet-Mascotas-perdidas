package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.enums.EstadoPedido;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    @Query("SELECT p FROM Pedido p WHERE p.codigo = :codigo")
    Optional<Pedido> findByCodigo(String codigo);

    @Query("""
            SELECT p
            FROM Pedido p
            WHERE p.codigo = :codigo
              AND p.emailConsumidor = :emailConsumidor
            """)
    Optional<Pedido> findByCodigoAndEmailConsumidor(
            String codigo,
            String emailConsumidor
    );

    @Query("SELECT p FROM Pedido p WHERE p.estado = :estado")
    List<Pedido> findByEstado(
            EstadoPedido estado
    );

    @Query("SELECT p FROM Pedido p WHERE p.estado IN :estados")
    List<Pedido> findByEstadoIn(
            List<EstadoPedido> estados
    );
}