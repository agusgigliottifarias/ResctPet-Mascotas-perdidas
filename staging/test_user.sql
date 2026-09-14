-- Insertar usuario de prueba con email 'test@resctpet.com' y contraseña '123456' (Hash BCrypt Real)
INSERT INTO usuarios (id, nombre, apellido, email, password)
VALUES (1, 'Usuario', 'Test', 'test@resctpet.com', '$2a$10$X5p09Z6/N50wHk10wF/9eeGzTqB6Q76sV5rN01k/H0.J6k8m8Q5sS')
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email, 
    password = EXCLUDED.password;

-- Sincronizar la secuencia de IDs
SELECT setval('usuarios_id_seq', COALESCE((SELECT MAX(id) FROM usuarios), 1));