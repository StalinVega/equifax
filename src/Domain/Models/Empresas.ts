import moment from "moment-timezone";
import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../Infrastructure/database';
import { Usuario } from "./Usuario"; // Importa el modelo Usuario para las relaciones

export class Empresa extends Model {
  public id!: number;
  public nombreEmpresa!: string;
  public correoEmpresa!:string;
  public responsable!: string;
  public correoResponsable!: string;
  public textoDocumento!: string;
  public responsableEquifax!: string;
  public cargoEquifax!: string;
  public createdAt!: Date;

  // Transformación de la fecha y hora
  public toJSON() {
    const values = Object.assign({}, this.get());

    values.createdAt = moment(values.createdAt).tz('America/Guayaquil').format();

    return values;
  }
}

Empresa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_empresa",
    },
    nombreEmpresa: {
      type: DataTypes.STRING(100),
      field: "nombre_empresa",
    },
    correoEmpresa:{
      type: DataTypes.STRING(100),
      unique:true,
      field: "correo_empresa",
    },
    responsable: {
      type: DataTypes.STRING(100),
      field: "responsable",
    },
    correoResponsable: {
      type: DataTypes.STRING(100),
      field: "correo_responsable",
    },
    textoDocumento: {
      type: DataTypes.STRING(100),
      field: "texto_documento",
    },
    responsableEquifax: {
      type: DataTypes.STRING(100),
      field: "responsable_equifax",
    },
    cargoEquifax: {
      type: DataTypes.STRING(100),
      field: "cargo_equifax",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_creacion",
    },
  },
  {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresas',
    timestamps: false,
  }
);

// Relación: Una empresa tiene muchos usuarios
Empresa.hasMany(Usuario, { foreignKey: 'id_empresa', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });