const User = require('./User');
const Location = require('./Location');
const Trips = require('./Trips');

User.hasMany(Trips, {
  foreignKey: 'traveller_id',
  onDelete: 'CASCADE',
});

// A reader can have many books
User.hasMany(Trips, {
  foreignKey: 'location_id',
  onDelete: 'CASCADE',
});

// A book belongs to a single reader
Location.belongsToMany(Trips, {
  foreignKey: 'reader_id',
});

Trips.belongsTo(Reader, {
  foreignKey: 'reader_id',
});

module.exports = { User, Location, Trips };
