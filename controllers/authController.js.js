const UserModel = require('../models/User');

exports.login = async (req, res) => {
    try {
        // Lógica para verificar las credenciales del usuario
        const user = await UserModel.find(req.body.username, req.body.password);
        if (user) {
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Authentication failed');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.register = async (req, res) => {
    try {
        const newUser = await UserModel.create(req.body);
        req.session.user = newUser;
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Internal server error');
    }
};
