import jwt from "jsonwebtoken";

export function userAuthentication(req, res, next) {
    const token = req.cookies.userjwt;
    // console.log(req.cookies)

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, "jwtid");//for verifying token 
        // console.log(decoded);
        req.user = decoded.userId;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }

    return next();
}