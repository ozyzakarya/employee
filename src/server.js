const app = require("./app");
const port = 3000;
require('dotenv').config()

app.listen(process.env.PORT || port, () => {
	console.log(`Server now up and running on port ${port}`);
});
