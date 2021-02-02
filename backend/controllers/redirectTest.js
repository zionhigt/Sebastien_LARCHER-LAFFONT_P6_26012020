
module.exports = (req, res, next) => {
	res.status(222).json({
		body: req.body,
		params: req.params
	});
};