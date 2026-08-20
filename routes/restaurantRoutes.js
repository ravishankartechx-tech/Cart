const express = require('express'); const router = express.Router(); router.get('/', (req, res) => res.json({ message: 'restaurantRoutes working' })); module.exports = router;
