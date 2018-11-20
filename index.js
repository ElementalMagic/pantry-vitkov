const app = require('./app')
const port = process.env.PORT || 22;

app.listen(port, () => console.log(`Server has been started at port ${port}`));
