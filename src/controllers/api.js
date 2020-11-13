const rp = require('request-promise');

exports.GetCostData = (req, res) => {

    const options = {
        method: 'POST',
        url: 'https://api.rajaongkir.com/starter/cost',
        headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca', 'content-type': 'application/x-www-form-urlencoded'},
        form: {origin: req.body.form.origin, destination: req.body.form.destination, weight: req.body.form.weight, courier: req.body.form.courier}
    };
     
    rp(options)
        .then(function (repos) {
            // console.log('User has %d repos', repos.length);
            res.status(200).send({
                    data: repos
            });
        })
        .catch(function (err) {
            console.log(err);
        });
};

exports.GetAllCityData = (req, res) => {

    const options = {
        uri: 'https://api.rajaongkir.com/starter/city',
        headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca'},
        json: true
    };
     
    rp(options)
        .then(function (repos) {
            // console.log('User has %d repos', repos.length);
            res.status(200).send({
                    data: repos
            });
        })
        .catch(function (err) {
            console.log(err);
        });
};
