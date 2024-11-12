import moment from "moment-timezone";
import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';
import { Cliente } from "./Cliente";
import { Usuario } from "./Usuario";
export class Solicitud extends Model {
  public id!: number;
  public idCliente!: number;
  public idProceso!: number;
  public idUsuario!: number;
  public createdAt!: Date;

  // Transformacion de la fecha y hora
  public toJSON() {
    const values = Object.assign({}, this.get());

    values.createdAt = moment(values.createdAt).tz('America/Guayaquil').format();

    return values;
  }
}

Solicitud.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_solicitud",
    },
    idCliente: {
      type: DataTypes.INTEGER,
      field: "id_cliente",
    },
    idProceso: {
      type: DataTypes.INTEGER,
      field: "id_proceso",
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      field: "id_usuario",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_solicitud", 
    },
  },
  {
    sequelize,
    modelName: 'Solicitud',
    tableName: 'solicitudes',
    timestamps: true,
  })

// // Relación: Cada solicitud pertenece a un cliente, un proceso y un usuario
Solicitud.belongsTo(Cliente, { foreignKey: 'id_cliente'});
Cliente.hasMany(Solicitud, { foreignKey: 'id_cliente'});

Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario'});
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario'});