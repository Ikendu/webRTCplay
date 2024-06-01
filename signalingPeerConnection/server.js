const express = require("express");
const app = express();

//use express to display the static html
app.use(express.static(__dirname));
app.listen(5000);
