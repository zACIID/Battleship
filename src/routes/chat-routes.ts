

const router = new express.Router();


// Retrieving schema from model
const chatSchema = require('../models/chat');
const userSchema = require('../models/user');
const matchSchema = require('../models/match');

router.get('/chats', (req, res, next) => {

	// Check if user is logged
    if (!req.user_id) { return res.status(401).send('Not authenticated'); }

	const { ids } = req.query;
    if (!ids) {
      return res.status(400).send('Bad Request');
    }

	// Retrieve userId from the parameters of the request
	const user = req.params.userId;

	// Find all the existing chat where an user is found inside the "users" list
    userSchema.findById(user)
    .lean()
    .exec()
    .then(found => {
        res.json(found.chats);
    })
	.catch(next);
})

module.exports = router
