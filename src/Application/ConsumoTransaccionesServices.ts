import { sequelize } from "../Infrastructure/database";
import { ConsumoTransacciones } from "../Domain/Models/consumoTransacciones";
import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";
import { Solicitud } from "../Domain/Models/Solicitud";
import { Usuario } from "../Domain/Models/Usuario";



export class ConsumoTransaccionesService {
    public async consumirTransaccion(data: any) {
        const transaction = await sequelize.transaction(); // Iniciamos una transacción
    
        try {
            // 1️⃣ Verificar que el paquete existe y bloquear la fila para evitar condiciones de carrera
            const paquete = await PaqueteTransacciones.findOne({
                where: { id_paquete: data.idPaquete },
                lock: transaction.LOCK.UPDATE, // Bloquea la fila hasta que termine la transacción
                transaction,
            });
    
            if (!paquete) throw new Error('Paquete no encontrado');
    
            // 2️⃣ Verificar que la solicitud existe
            const solicitud = await Solicitud.findOne({
                where: { id_solicitud: data.idSolicitud },
                transaction,
            });
    
            if (!solicitud) throw new Error('Solicitud no encontrada');
    
            // 3️⃣ Verificar que el usuario de la solicitud pertenece a la misma empresa que el paquete
            const usuario = await Usuario.findOne({
                where: { id_usuario: solicitud.idUsuario },
                transaction,
            });
    
            if (!usuario || usuario.idEmpresa !== paquete.idEmpresa) {
                throw new Error('El usuario de la solicitud no pertenece a la empresa del paquete');
            }
    
            // 4️⃣ Verificar saldo suficiente en el paquete
            if (paquete.cantidadRestante < data.cantidadUsada) {
                throw new Error('Saldo insuficiente en el paquete');
            }
    
            // 5️⃣ Actualizar la cantidad restante en el paquete
            paquete.cantidadRestante -= data.cantidadUsada;
            await paquete.save({ transaction });
    
            // 6️⃣ Registrar el consumo
            const consumo = await ConsumoTransacciones.create(
                {
                    id_paquete: data.idPaquete,
                    id_solicitud: data.idSolicitud,
                    cantidad_usada: data.cantidadUsada,
                },
                { transaction }
            );
    
            // 7️⃣ Confirmar transacción
            await transaction.commit();
    
            return consumo;
        } catch (error) {
            await transaction.rollback(); // Revertimos cambios si hay error
            throw new Error(`Error al consumir transacción: ${error}`);
        }
    }


}

export async function obtenerIdPaquetePorClienteYSolicitud(idCliente: number, idSolicitud: number) {
    // 1️⃣ Verificar que la solicitud existe y pertenece al cliente
    const solicitud = await Solicitud.findOne({
        where: { id_solicitud: idSolicitud, id_cliente: idCliente }
    });

    if (!solicitud) {
        throw new Error('Solicitud no encontrada o no pertenece al cliente');
    }

    // 2️⃣ Obtener el id_usuario y el id_proceso de la solicitud
    const { idUsuario, idProceso } = solicitud;

    // 3️⃣ Buscar el paquete correspondiente al id_usuario y al id_proceso de la solicitud
    const paquete = await PaqueteTransacciones.findOne({
        where: { idUsuario, idProceso }
    });

    if (!paquete) {
        throw new Error('No se encontró un paquete válido para este usuario y proceso');
    }

    // 4️⃣ Devolver el idPaquete encontrado
    return paquete.idPaquete;
}