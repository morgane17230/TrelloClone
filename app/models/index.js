const List = require('./list');
const Card = require('./card');
const Label = require('./label');

Card.belongsToMany(Label, {
    as: 'labels',
    through: 'card_has_label',
    foreignKey: 'card_id',
    otherKey: 'label_id',
    timestamps: false,
});

Label.belongsToMany(Card, {
    as: 'cards',
    through: 'card_has_label',
    foreignKey: 'label_id',
    otherKey: 'card_id',
    timestamps: false,
});

List.hasMany(Card, {
    as: 'cards',
    foreignKey: 'list_id',
});

Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id',
});

module.exports = { Card, List, Label };