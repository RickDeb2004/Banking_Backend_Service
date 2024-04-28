// src/index.js
// src/index.js
const express = require('express');

const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/loans', loanRoutes);

// Connect to database and ingest data
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Database synced successfully');
//     return ingestData();
//   })
//   .then(() => {
//     console.log('Data ingested successfully');
//   })
//   .catch(err => {
//     console.error('Error syncing database:', err);
//   });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
