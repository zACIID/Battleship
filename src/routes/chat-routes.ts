

const router = new express.Router();


// Retrieving schema from model
const chats = require('../models/chat');


router.get('/', (req, res, next) => {

	// Check if user is logged
    if (!req.user_id) { return res.status(401).send('Not authenticated'); }
    
	const { ids } = req.query;
    if (!ids) {
      return res.status(400).send('Bad Request');
    }

	// Retrieve userId from the parameters of the request
	const user = req.params.userId;
	
	// Find all the existing chat where an user is found inside the "users" list
    chats.find({ users: user })
    .lean()
    .exec()
    .then(found => {
        if (found.length === 0) {
            return res.status(404).send('Chats not found');
        }
        res.json(found);
    })
	.catch(next);
})

module.exports = router
