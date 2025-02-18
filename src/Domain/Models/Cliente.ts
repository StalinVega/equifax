import moment from "moment-timezone";
import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';


export class Cliente extends Model {
    public id!: number;
    public nombre!: string;
    public apellido!: string;
    public correo!: string;
    public cedula!: string;
    public numTramite!: string;
    public createdAt!: Date;
  
    // Transformacion de la fecha y hora
    public toJSON() {
      const values = Object.assign({}, this.get());
  
      values.createdAt = moment(values.createdAt).tz('America/Guayaquil').format();
  
      return values;
    }
  }

  Cliente.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_cliente",
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cedula: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      numTramite: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "num_tramite",
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "email",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "fecha_creacion", 
      },
    },
    {
      sequelize,
      modelName: 'Cliente',
      tableName: 'clientes',
      timestamps: true,
    }
  );




