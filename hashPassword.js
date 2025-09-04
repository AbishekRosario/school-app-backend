const bcrypt = require("bcrypt");
const hash = await bcrypt.hash("teacher123", 10);
