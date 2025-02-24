import { sequelize } from "../Infrastructure/database";
import { ConsumoTransacciones } from "../Domain/Models/consumoTransacciones";
import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";
import { Solicitud } from "../Domain/Models/Solicitud";
import { Usuario } from "../Domain/Models/Usuario";
import { Op } from "sequelize";


export class ConsumoTransaccionesService {
    public async consumirTransaccion(data: any) {
        const transaction = await sequelize.transaction(); // Iniciamos una transacción
        console.log("Datos recibidos:", data);
    
        if (!data.idPaquete || !data.idSolicitud || !data.cantidadUsada) {
            throw new Error("Datos incompletos para la transacción");
        }
    
        try {
            // 1️⃣ Buscar el paquete inicial para obtener idEmpresa e idProceso
            const paqueteInicial = await PaqueteTransacciones.findOne({
                where: { id_paquete: data.idPaquete },
                lock: transaction.LOCK.UPDATE, // Bloquear la fila para evitar condiciones de carrera
                transaction,
            });
    
            if (!paqueteInicial) {
                throw new Error('Paquete no encontrado');
            }
    
            const idEmpresa = paqueteInicial.idEmpresa;
            const idProceso = paqueteInicial.idProceso;
    
            // 2️⃣ Buscar todos los paquetes activos para la empresa y proceso
            const paquetes = await PaqueteTransacciones.findAll({
                where: {
                    idEmpresa: idEmpresa,
                    idProceso: idProceso,
                    cantidadRestante: { [Op.gt]: 0 }, // Solo paquetes con saldo disponible
                },
                order: [['fechaCompra', 'ASC']], // Ordenar por fecha de compra (más antiguo primero)
                lock: transaction.LOCK.UPDATE, // Bloquear las filas para evitar condiciones de carrera
                transaction,
            });
    
            if (paquetes.length === 0) {
                throw new Error('No hay paquetes disponibles para este proceso');
            }
    
            // 3️⃣ Verificar que la solicitud existe
            const solicitud = await Solicitud.findOne({
                where: { id_solicitud: data.idSolicitud },
                transaction,
            });
    
            if (!solicitud) throw new Error('Solicitud no encontrada');
    
            // 4️⃣ Verificar que el usuario de la solicitud pertenece a la misma empresa
            const usuario = await Usuario.findOne({
                where: { id_usuario: solicitud.idUsuario },
                transaction,
            });
    
            if (!usuario || usuario.idEmpresa !== idEmpresa) {
                throw new Error('El usuario de la solicitud no pertenece a la empresa del paquete');
            }
    
            let cantidadRestante = data.cantidadUsada;
            let paqueteSeleccionado = null;
    
            // 5️⃣ Recorrer los paquetes y consumir la cantidad necesaria
            for (const paquete of paquetes) {
                if (cantidadRestante <= 0) break; // Si ya se consumió la cantidad necesaria, salir del bucle
    
                if (paquete.cantidadRestante >= cantidadRestante) {
                    // Si el paquete tiene suficiente saldo, consumir todo
                    paquete.cantidadRestante -= cantidadRestante;
                    cantidadRestante = 0;
                    paqueteSeleccionado = paquete;
                } else {
                    // Si el paquete no tiene suficiente saldo, consumir lo que haya y pasar al siguiente
                    cantidadRestante -= paquete.cantidadRestante;
                    paquete.cantidadRestante = 0;
                }
    
                await paquete.save({ transaction });
            }
    
            if (cantidadRestante > 0) {
                throw new Error('No hay suficiente saldo en los paquetes para completar la transacción');
            }
            if (!paqueteSeleccionado) {
                throw new Error('No se seleccionó ningún paquete para registrar el consumo');
            }
    
            // 6️⃣ Registrar el consumo
            const consumo = await ConsumoTransacciones.create(
                {
                    idPaquete: paqueteSeleccionado.idPaquete,
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
