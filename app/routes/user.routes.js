module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    app.post('/login', users.findUserByCredentials);

    app.post('/signup', users.create);

    app.get('/users', users.findAll);

    app.get('/users/:userId', users.findOne);

    app.put('/users/:userId', users.update);

    app.delete('/users/:userId', users.delete);

    app.post('/logout', users.logout);
}
