package unpsjb.labprog.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import unpsjb.labprog.backend.model.SplitPago;

public interface SplitPagoRepository
        extends JpaRepository<SplitPago, Long> {

    List<SplitPago> findByReferenciaDestino(
            String referenciaDestino
    );

    @Query("""
        SELECT s
        FROM SplitPago s
        WHERE s.destino = 'REPARTIDOR'
          AND s.referenciaDestino = :codigoRepartidor
          AND s.liquidable = true
    """)
    List<SplitPago> findLiquidablesByRepartidor(
            @Param("codigoRepartidor")
            String codigoRepartidor
    );
}