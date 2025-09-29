const router = require("express").Router();
const supabase = require("../supaBaseClient");
const { authenticateToken, role_permission } = require("../middleware");

router.post(
  "/submit",
  authenticateToken,
  role_permission("Normal User"),
  async (req, res) => {
    const { user_id, reason } = req.body;
    try {
      if (!user_id || !reason) {
        return res.status(400).json({ msg: "All fields are required" });
      }
      const { data, error } = await supabase
        .from("permission_slips")
        .insert([{ user_id, reason }]);
      if (error) {
        throw error;
      }
      console.log(data);
      return res
        .status(201)
        .json({ msg: "Permission slip submitted successfully", data: data });
    } catch (error) {
      console.error("Error submitting permission slip:", error.message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);

router.get(
  "/all",
  authenticateToken,
  role_permission("Normal User"),
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("permission_slips")
        .select("*");
      if (error) {
        throw error;
      }
      return res
        .status(200)
        .json({ msg: "Permission slips fetched successfully", data: data });
    } catch (error) {
      console.error("Error fetching permission slips:", error.message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);
router.put("/update/:slip_id/:reviewed_by", authenticateToken, role_permission("President"),  async (req, res) => {
  const { slip_id, reviewed_by } = req.params;
  const { status } = req.body;
  console.log(slip_id, reviewed_by);
  try {
    if (!status) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const { data, error } = await supabase
      .from("permission_slips")
      .update({ status, reviewed_by })
      .eq("id", slip_id); 
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ msg: "Permission slip updated successfully ", data: data });
  } catch (error) {
    console.error("Error updating permission slip:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  } 
});

module.exports = router;
