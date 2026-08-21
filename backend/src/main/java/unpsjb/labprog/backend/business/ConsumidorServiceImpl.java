package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Consumidor;
import unpsjb.labprog.backend.model.dto.ConsumidorDTO;
import unpsjb.labprog.backend.model.dto.LoginRequest;
import unpsjb.labprog.backend.model.dto.RegisterRequest;
import unpsjb.labprog.backend.repository.ConsumidorRepository;

@Service
public class ConsumidorServiceImpl implements ConsumidorService {

    private final ConsumidorRepository repository;
    private final ConsumidorMapper mapper;
    private final ConsumidorValidator validator;

    @Autowired
    public ConsumidorServiceImpl(
            ConsumidorRepository repository,
            ConsumidorMapper mapper,
            ConsumidorValidator validator
    ) {
        this.repository = repository;
        this.mapper = mapper;
        this.validator = validator;
    }

    @Override
    @Transactional
    public ConsumidorDTO registrar(RegisterRequest request) {
        validator.validarRegistro(request);

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConsumidorException("CONFLICTO - EMAIL_DUPLICADO");
        }

        Consumidor consumidor = Consumidor.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(request.getPassword())
                .activo(true)
                .build();

        Consumidor guardado = repository.save(consumidor);
        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public ConsumidorDTO login(LoginRequest request)  {
        validator.validarLogin(request);

        Consumidor consumidor = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ConsumidorException("CONFLICTO - USUARIO_NO_ENCONTRADO"));

        if (!consumidor.isActivo()) {
            throw new ConsumidorException("CONFLICTO - USUARIO_INACTIVO");
        }

        if (!consumidor.getPassword().equals(request.getPassword())) {
            throw new ConsumidorException("CONFLICTO - CREDENCIALES_INVÁLIDAS");
        }

        return mapper.toDTO(consumidor);
    }

    @Transactional(readOnly = true)
    @Override
    public ConsumidorDTO buscarPorEmail(String email) {

    validator.validarEmail(email);
    Consumidor consumidor = repository.findByEmail(email)
            .orElseThrow(() -> new ConsumidorException("CONFLICTO - USUARIO_NO_ENCONTRADO"));

    return mapper.toDTO(consumidor);
   }
}