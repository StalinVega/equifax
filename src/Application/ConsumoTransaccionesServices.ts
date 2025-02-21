import { sequelize } from "../Infrastructure/database";
import { ConsumoTransacciones } from "../Domain/Models/consumoTransacciones";
import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";
import { Solicitud } from "../Domain/Models/Solicitud";
import { Usuario } from "../Domain/Models/Usuario";



export class ConsumoTransaccionesService {
    public async consumirTransaccion(data: any) {
        const transaction = await sequelize.transaction(); // Iniciamos una transacción
        console.log("Datos recibidos:", data);
        if (!data.idPaquete || !data.idSolicitud || !data.cantidadUsada) {
            throw new Error("Datos incompletos para la transacción");
        }
        try {
            // 1️⃣ Verificar que el paquete existe y bloquear la fila para evitar condiciones de carrera
            const paquete = await PaqueteTransacciones.findOne({
                where: { id_paquete: data.idPaquete },
                lock: transaction.LOCK.UPDATE, // Bloquea la fila hasta que termine la transacción
                transaction,
            });
            console.log()
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
                    idPaquete: data.idPaquete,
                    idSolicitud: data.idSolicitud,
                    cantidadUsada: data.cantidadUsada,
                    fechaConsumo: data.fechaConsumo,
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

    // 2️⃣ Obtener el idUsuario e idProceso de la solicitud
    const { idUsuario, idProceso } = solicitud;

    // 3️⃣ Obtener la empresa a la que pertenece el usuario
    const usuario = await Usuario.findOne({
        where: { id_usuario: idUsuario }
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const { idEmpresa } = usuario;

    // 4️⃣ Buscar el paquete correspondiente a la empresa e idProceso
    const paquete = await PaqueteTransacciones.findOne({
        where: { idEmpresa, idProceso }
    });

    if (!paquete) {
        throw new Error('No se encontró un paquete válido para esta empresa y proceso');
    }

    // 5️⃣ Devolver el idPaquete encontrado
    return paquete.idPaquete;
}
