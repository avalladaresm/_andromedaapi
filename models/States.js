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
      unique: 'UQ__States__3213E83E6BFC2936'
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
    countryId: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'countryId',
      references: {
        key: 'id',
        model: 'Countries_model'
      }
    }
  }
  const options = {
    tableName: 'States',
    comment: '',
    indexes: [],
    timestamps: false,
  }
  const StatesModel = sequelize.define('States_model', attributes, options)
  return StatesModel
}
