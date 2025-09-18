const router = require("express").Router();
const supabase = require("../supaBaseClient");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  const { email, username, password, role } = req.body;
  try {
    if (!email || !username || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword) // Implement password hashing here
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, username, hashedPassword, role }]);
    if (error) {
      throw error;
    }
    return res
      .status(201)
      .json({ msg: "User registered successfully", data: data });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/login", async (req, res) => {
  
  res.status(200).json({ msg: "login" });
});

module.exports = router;
