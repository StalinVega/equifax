import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';


export class ConsumoTransacciones extends Model {
    public idConsumo!: number;
    public idSolicitud!: number;
    public cantidadUsada!: number;
    public fechaConsumo!: Date;
}

ConsumoTransacciones.init(
    {
        idConsumo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "id_consumo",
        },
        idSolicitud: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_solicitud",
        },
        cantidadUsada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: "cantidad_usada",
        },
        fechaConsumo: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "fecha_consumo",
        },
    },
    {
        sequelize,
        modelName: "ConsumoTransacciones",
        tableName: "consumo_transacciones",
        timestamps: false,
    }
);




