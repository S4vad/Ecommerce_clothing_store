import jwt from "jsonwebtoken";

export function adminAuthentication(req, res, next) {
    const token = req.cookies.adminjwt;

    if (!token) {
        res.render('admin/adminLogin')
       
    }

    try {
        const decoded = jwt.verify(token, "adminjwtid");
        req.admin = decoded.adminId;  
    } catch (err) {
        
        return next()
    }

    return next();
}


