package unpsjb.labprog.backend.presenter;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ConsumidorException;
import unpsjb.labprog.backend.business.NotificacionEtaException;
import unpsjb.labprog.backend.business.PagoFallidoException;
import unpsjb.labprog.backend.business.TrackingException;
import org.springframework.http.HttpStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConsumidorException.class)
    public ResponseEntity<Object> handleConsumidorException(
            ConsumidorException ex
    ) {

        return Response.conflict(
                ex.getMessage()
        );
    }

    @ExceptionHandler(PagoFallidoException.class)
    public ResponseEntity<Object> handlePagoFallidoException(
            PagoFallidoException ex
    ) {

        return Response.conflict(
                ex.getData(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(TrackingException.class)
    public ResponseEntity<Object> handleTrackingException(
            TrackingException ex
    ) {

        return Response.conflict(
                ex.getData(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(NotificacionEtaException.class)
    public ResponseEntity<Object> handleNotificacionEtaException(
            NotificacionEtaException ex
    ) {

        return Response.conflict(
                ex.getData(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(
            ResponseStatusException ex
    ) {

        return Response.conflict(
                ex.getReason()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(
            DataIntegrityViolationException ex
    ) {

        return Response.conflict(
                "CONFLICTO - ERROR_INTEGRIDAD_BASE_DATOS"
        );
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<Object> handleOptimisticLock(
            ObjectOptimisticLockingFailureException ex
    ) {

        return Response.conflict(
                "CONFLICTO - REGISTRO_MODIFICADO_CONCURRENTEMENTE"
        );
    }

    @ExceptionHandler(CannotCreateTransactionException.class)
    public ResponseEntity<Object> handleCannotCreateTransaction(
            CannotCreateTransactionException ex
    ) {

        return Response.response(
                HttpStatus.SERVICE_UNAVAILABLE,
                "ERROR - BASE_DATOS_NO_DISPONIBLE",
                null
        );
    }

    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<Object> handleTransactionSystem(
            TransactionSystemException ex
    ) {

        return Response.conflict(
                "ERROR - TRANSACCION_BASE_DATOS"
        );
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Object> handleDataAccess(
            DataAccessException ex
    ) {

        return Response.conflict(
                "ERROR - ACCESO_BASE_DATOS"
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(
            RuntimeException ex
    ) {

        String mensaje = ex.getMessage();

        if (mensaje != null
                && mensaje.startsWith("CONFLICTO")) {

            return Response.conflict(
                    mensaje
            );
        }

        String detalleError
                = (mensaje != null && !mensaje.isBlank())
                ? mensaje
                : "OPERACION_FALLIDA";

        return Response.conflict(
                "ERROR - " + detalleError
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(
            Exception ex
    ) {

        ex.printStackTrace();

        return Response.conflict(
                "ERROR_CRITICO - "
                + ex.getMessage()
        );
    }

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(
            org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex
    ) {

        return Response.conflict(
                "CONFLICTO - PARAMETRO_INVALIDO"
        );
    }
}
