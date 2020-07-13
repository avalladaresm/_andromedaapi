const {
  DataTypes
} = require('sequelize')

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: 'id',
      unique: 'UQ__Countrie__3213E83E0E52B734'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'name',
      unique: 'UQ__Countrie__72E12F1BC4AAC3FF'
    }
  }
  const options = {
    tableName: 'Countries',
    comment: '',
    indexes: [],
    timestamps: false,
  }
  const CountriesModel = sequelize.define('Countries_model', attributes, options)
  return CountriesModel
}
