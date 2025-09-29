const jwt = require("jsonwebtoken");
const supabase = require("./supaBaseClient");
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    // console.log("user", user);
    req.user = user;
    // console.log(user)
    next();
  });
}

function role_permission(...permissions) {
  return async (req, res, next) => {
    const { data } = await supabase
      .from("roles")
      .select("*")
      .eq("id", req.user.role_id)
      .single();
    // console.log("role", permissions.includes(data.name));
    if (!permissions.includes(data.name)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  role_permission,
};
