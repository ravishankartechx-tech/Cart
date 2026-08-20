const express = require('express'); const router = express.Router(); router.get('/', (req, res) => res.json({ message: 'authRoutes working' })); module.exports = router;
