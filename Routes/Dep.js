const router = require("express").Router();
const supabase = require("../supaBaseClient");
const authenticateToken = require("../middleware");

router.get("/all",authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
        .from("departments")
        .select("*");
    if (error) {
      throw error;
    }
    return res.status(200).json({ msg: "Departments fetched successfully", data: data });
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  } 
});

router.post("/add",authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const { data, error } = await supabase
      .from("departments")
      .insert([{ name }]);
    if (error) {
      throw error;
    }
    return res
      .status(201)
      .json({ msg: "Department added successfully", data: data });
  } catch (error) {
    console.error("Error adding department:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});


module.exports = router;
