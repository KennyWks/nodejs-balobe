var rp = require('request-promise');

exports.GetAllProvincesData = (req, res) => {

    var options = {
        uri: 'https://api.rajaongkir.com/starter/province',
        qs: {id: `${req.params.id ? req.params.id : ''}`},
        headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca'},
        json: true
    };
     
    rp(options)
        .then(function (repos) {
            console.log('User has %d repos', repos.length);
            res.status(200).send({
                    data: repos
            });
        })
        .catch(function (err) {
            console.log(err);
        });
};

exports.GetAllCityData = (req, res) => {

    var options = {
        uri: 'https://api.rajaongkir.com/starter/city',
        qs: {id: `${req.params.id ? req.params.id : ''}`},
        headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca'},
        json: true
    };
     
    rp(options)
        .then(function (repos) {
            console.log('User has %d repos', repos.length);
            res.status(200).send({
                    data: repos
            });
        })
        .catch(function (err) {
            console.log(err);
        });
};
