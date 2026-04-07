import { Router, type IRouter } from "express";
import healthRouter from "./health";
import basesRouter from "./bases";
import blogRouter from "./blog";
import commentsRouter from "./comments";
import reportsRouter from "./reports";
import submissionsRouter from "./submissions";
import analyticsRouter from "./analytics";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(basesRouter);
router.use(blogRouter);
router.use(commentsRouter);
router.use(reportsRouter);
router.use(submissionsRouter);
router.use(analyticsRouter);
router.use(uploadRouter);

export default router;
