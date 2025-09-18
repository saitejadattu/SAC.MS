const router = require("express").Router();
const supabase = require("../supaBaseClient");
const authenticateToken = require("../middleware");


router.post("/submit", authenticateToken, async (req, res) => {
    const {user_id, reason, status, created_at} = req.body;
    try {
        if (!user_id || !reason || !status || !created_at) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const { data, error } = await supabase
            .from("permission_slips")
            .insert([{ user_id, reason, status, created_at }]);
        if (error) {
            throw error;
        }
        return res
            .status(201)
            .json({ msg: "Permission slip submitted successfully", data: data });
    } catch (error) {
        console.error("Error submitting permission slip:", error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.get("/all", authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("permission_slips")
            .select("*");
        if (error) {
            throw error;
        }
        return res.status(200).json({ msg: "Permission slips fetched successfully", data: data });
    } catch (error) {
        console.error("Error fetching permission slips:", error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;