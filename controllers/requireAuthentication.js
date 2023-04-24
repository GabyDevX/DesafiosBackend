const requireAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('logged in');
    console.log(req.user);
    next();
  } else {
    console.log('no logged in');
    res.redirect("/login");
  }
};

export default { requireAuthentication };
