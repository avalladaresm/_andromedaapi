const {
  DataTypes
} = require('sequelize')

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: 'id',
      unique: 'UQ__Cities__3213E83EC06E8F63'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'name'
    },
    stateId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'stateId',
      references: {
        key: 'id',
        model: 'States_model'
      }
    }
  }
  const options = {
    tableName: 'Cities',
    comment: '',
    indexes: [],
    timestamps: false,
  }
  const CitiesModel = sequelize.define('CitiesModel', attributes, options)
  return CitiesModel
}