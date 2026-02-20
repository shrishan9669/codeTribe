import { Router } from "express";
const adminRouter = Router();
adminRouter.get('/get', async (req, res) => {
    return res.json({
        msg: "Hello ishan"
    });
});
export default adminRouter;
//# sourceMappingURL=user.js.map