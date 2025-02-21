import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';
import { ConsumoTransacciones } from "./consumoTransacciones";


export class PaqueteTransacciones extends Model {
    public idPaquete!: number;
    public idEmpresa!: number;
    public idProceso!: number;
    public cantidadComprada!: number;
    public cantidadRestante!: number;
    public fechaCompra!: Date;
}

PaqueteTransacciones.init(
    {
        idPaquete: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "id_paquete",
        },
        idEmpresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_empresa",
        },
        idProceso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_proceso",
        },
        cantidadComprada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cantidad_comprada",
        },
        cantidadRestante: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cantidad_restante",
        },
        fechaCompra: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "fecha_compra",
        },
    },
    {
        sequelize,
        modelName: "PaqueteTransacciones",
        tableName: "paquetes_transacciones",
        timestamps: false,
    }
);

// PaqueteTransacciones.ts

ConsumoTransacciones.belongsTo(PaqueteTransacciones, {
    foreignKey: "id_paquete",
    as: "paquete",
});
PaqueteTransacciones.hasMany(ConsumoTransacciones, {
    foreignKey: "id_paquete",
    as: "consumos",
});



