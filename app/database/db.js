const mongoose = require('mongoose');
const { CODE } = require('../lib/index');
const logger = require('../lib/logger');
const env = require('../config/config');
const db = mongoose.connection;

const mongoConnect = () => {
	mongoose.connect(process.env.MONGO_URI || env.get('/mongo'), {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	db.on('error', (error) =>
		logger.log(
			`app is on code ${CODE.BAD_GATEWAY}`,
			error,
			'not connected',
		),
	);
	db.once('open', () => {
		let ctx = 'db-connection';
		logger.log(ctx, 'connected!', 'database running');
	});
};

module.exports = mongoConnect;
