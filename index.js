const express = require("express");
const cors = require("cors");
const supabase = require("./supaBaseClient");
const dotenv = require("dotenv");
const auth_router = require('./Routes/Auth');
const dep_router = require('./Routes/Dep');
const permissionSlip_router = require('./Routes/PermissionSlip');
const morgan = require("morgan");
dotenv.config({ quiet: true });

const app = express();
app.use(morgan("dev"))
app.use(cors());
app.use(express.json());
app.use('/auth', auth_router);
app.use('/department', dep_router);
app.use('/permission-slip', permissionSlip_router);

async function connectAndVerify() {
  try {
    // A simple, fast query to test the connection.
    // We are querying the 'countries' table which is often a default in Supabase.
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .limit(1);
    // console.log(data);
    if (error) {
      throw error;
    }

    console.log("✅ Supabase connected successfully!");
  } catch (err) {
    console.error("❌ Supabase connection failed!");
    console.error("Error details:", err.message);
    // Exit the process if the connection fails
    process.exit(1);
  }
}
connectAndVerify();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
