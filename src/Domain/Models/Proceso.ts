import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';
import { PaqueteTransacciones } from "./PaquetesTransacciones";


export class Proceso extends Model {
    public idProceso!: number;
    public tipoProceso!: "firma_electronica" | "verificacion_identidad";
    public descripcion!: string;
}

Proceso.init(
    {
        idProceso: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_proceso",
        },
        tipoProceso: {
            type: DataTypes.ENUM("firma_electronica", "verificacion_identidad"),
            allowNull: false,
            field: "tipo_proceso",
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Proceso",
        tableName: "procesos",
        timestamps: false,
    }
);

PaqueteTransacciones.belongsTo(Proceso, {
    foreignKey: "id_proceso",
    as: "proceso",
});

Proceso.hasMany(PaqueteTransacciones, {
    foreignKey: "id_proceso",
    as: "paquetes",
});