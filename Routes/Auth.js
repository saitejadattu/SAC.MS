const router = require("express").Router();
const supabase = require("../supaBaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
  const { email, full_name, password, role_id, department_id } = req.body;
  console.log(req.body);
  try {
    if (!email || !full_name || !password || !role_id || !department_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    // console.log(hashedPassword) // Implement password hashing here
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, full_name, password_hash, role_id, department_id }]);
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const isUser = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (isUser.error) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const validPassword = await bcrypt.compare(
    password,
    isUser.data.password_hash
  );
  if (!validPassword) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const jwtToken = jwt.sign(
    { id: isUser.data.id, email: isUser.data.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  console.log(jwtToken);
  res.status(200).json({ msg: "login successful", token: jwtToken });
});

module.exports = router;
