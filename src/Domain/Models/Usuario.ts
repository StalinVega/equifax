
import { sequelize } from '../../Infrastructure/database';
import { Model, DataTypes } from 'sequelize';
import moment from 'moment-timezone';
import { Solicitud } from './Solicitud';
import { PaqueteTransacciones } from './PaquetesTransacciones';

export class Usuario extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: "almacen" | "admin";
  public createdAt!: Date;

  // Transformacion de la fecha y hora
  public toJSON() {
    const values = Object.assign({}, this.get());

    values.createdAt = moment(values.createdAt).tz('America/Guayaquil').format();

    return values;
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_usuario",
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('almacen', 'admin'),
      allowNull: false,
      field: "rol",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_creacion", 
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
  }
);


PaqueteTransacciones.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});
Usuario.hasMany(PaqueteTransacciones, {
foreignKey: "id_usuario",
as: "paquetes",
});