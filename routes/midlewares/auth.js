import passport from "passport";

export function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("auth");
    next();
  } else {
    console.log("noauth");
    res.redirect("/login");
  }
}
