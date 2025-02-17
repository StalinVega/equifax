import { ConsumoTransacciones } from "../Domain/Models/consumoTransacciones";
import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";



export class ConsumoTransaccionesService {
    public async consumirTransaccion(data: any) {
        const paquete = await PaqueteTransacciones.findByPk(data.idPaquete);
        
        if (!paquete) throw new Error('Paquete no encontrado');
        if (paquete.cantidadRestante < data.cantidadUsada) throw new Error('Saldo insuficiente');

        // Actualizar cantidad restante
        paquete.cantidadRestante -= data.cantidadUsada;
        await paquete.save();

        // Registrar consumo
        return await ConsumoTransacciones.create(data);
    }


}