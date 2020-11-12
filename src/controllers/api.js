var rp = require('request-promise');

exports.GetAllProvincesData = (req, res) => {

    var options = {
        uri: 'https://api.rajaongkir.com/starter/province',
        qs: {
            qs: {id: `${req.params.id ? req.params.id : ''}`},
        },
        headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca'},
        json: true
    };
     
    rp(options)
        .then(function (repos) {
            console.log('User has %d repos', repos.length);
        })
        .catch(function (err) {
            // API call failed...
        });
};

// exports.GetDetailCategoryController = async (req, res) => {
//     try {
//         const result = await GetDetailCategoryModel(req.params.id);
//         console.log(result);
//         if (result[1][0]) {
//             res.status(200).send({
//                 data: result[1][0],
//             });
//         } else {
//             res.status(404).send({
//                 msg: "id category not found"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(404).send({
//             error: {
//                 msg: error.message || "something wrong",
//             },
//         });
//     }
// };
