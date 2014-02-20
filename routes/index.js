
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('etablissement', { title: 'OpenData76 - HackHours\'s Example', etablissements : etablissements });
};