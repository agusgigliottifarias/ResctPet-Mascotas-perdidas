package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.ConsumidorDTO;
import unpsjb.labprog.backend.model.dto.LoginRequest;
import unpsjb.labprog.backend.model.dto.RegisterRequest;

public interface ConsumidorService {
    ConsumidorDTO registrar(RegisterRequest request);
    ConsumidorDTO login(LoginRequest request);
    ConsumidorDTO buscarPorEmail(String email);
}