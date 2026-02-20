import { verifyJwt } from "../auth/jwt.js";
import { prisma } from '../Prisma/client.js';
export default async function Usermiddleware(req, res, next) {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    try {
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: "Token not found!!"
            });
        }
        const Verifytoken = verifyJwt(token);
        if (!Verifytoken.userId) {
            return res.status(400).json({
                ok: false,
                msg: "No info in token!!"
            });
        }
        const User = await prisma.user.findUnique({
            where: {
                id: Number(Verifytoken.userId)
            }
        });
        if (!User) {
            return res.status(400).json({
                ok: false,
                msg: "No User Found!!"
            });
        }
        req.user = User;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Failed to authenticate"
        });
    }
}
//# sourceMappingURL=middelware.js.map