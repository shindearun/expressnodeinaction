module.exports = (cb, perpage) => {
  perpage = perpage || 10;
  return (req, res, next) => {
    let page = Math.max(
      parseInt(req.params.page || '1', 10),
      1
    ) - 1;
    let userName = "";
    if(res.locals.user){
      userName = res.locals.user.name;
    }
    let queryObj = {};
    if(userName){
      queryObj = {
        username: userName
      }
    }
    cb((err, total) => {
      if (err) return next(err);
      req.page = res.locals.page = {
        number: page,
        perpage: perpage,
        from: page * perpage,
        to: page * perpage + perpage - 1,
        total: total,
        count: Math.ceil(total / perpage)
      };
      next();
    },queryObj);
  }
};
