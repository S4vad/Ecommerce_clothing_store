import jwt from "jsonwebtoken";

export function userAuthentication(req, res, next) {
    const token = req.cookies.userjwt;

    if (!token) {
        return next();
        // return res.status(403).send('A token is required for authentication');
       
    }

    try {
        const decoded = jwt.verify(token, "jwtid");//for verifying token 
        req.user = decoded.userId;  // this work like this example const object={name:"shaheer"}  ,object.age=15;
    } catch (err) {
        // return res.status(401).send('Invalid Token');
        return next()
    }

    return next();
}


