import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './user.js';
import adminRouter from './admin.js';
dotenv.config();
const app = Express();
app.use(cors());
app.use(Express.json());
app.use('/user', userRouter);
app.use('/admin', adminRouter);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Your server is running on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map