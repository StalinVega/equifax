import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';

export class AccesoProceso extends Model {
    public idUsuario!: number;
    public idProceso!: number;

}


AccesoProceso.init(
    {
        idUsuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: "id_usuario",
        },
        idProceso: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: "id_proceso",
        },
    },
    {
        sequelize,
        modelName: 'AccesoProceso',
        tableName: 'acceso_procesos',
        timestamps: false,
    }
);