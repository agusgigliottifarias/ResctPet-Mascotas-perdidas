package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.SaldoRepartidorDTO;

public interface SaldoRepartidorService {

    SaldoRepartidorDTO consultarSaldo(String codigoRepartidor);

}