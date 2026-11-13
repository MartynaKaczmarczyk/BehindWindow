const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '../frontend/dist/transit-tales/browser');

app.use(express.json());
app.use('/api/explore', require('./api/explore'));
app.use('/api/stories', require('./api/stories'));
app.use(express.static(frontendPath));

app.get('*', (req, res, next) => {
	if (req.path.startsWith('/api/')) return next();
	res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Radar działa na http://localhost:${PORT}`));