var request = require("request");

exports.GetAllProvincesData = (req, res) => {

    if(req.params.id) {
        var options = {
            method: 'GET',
            url: 'https://api.rajaongkir.com/starter/province',
            qs: {id: `${req.params.id}`},
            headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca'}
         };    
    } else {
        var options = {
            method: 'GET',
            url: 'https://api.rajaongkir.com/starter/province',
            headers: {key: '96ac5b6cdb274fd84c01ec9ed3ff1bca'}
         };
    }
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

        console.log(body);
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
