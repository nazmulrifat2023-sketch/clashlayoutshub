import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import basesRouter from "./bases.js";
import blogRouter from "./blog.js";
import commentsRouter from "./comments.js";
import reportsRouter from "./reports.js";
import submissionsRouter from "./submissions.js";
import analyticsRouter from "./analytics.js";
import uploadRouter from "./upload.js";
import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import analyzeRouter from "./analyze.js";
import proTipsRouter from "./pro-tips.js";

const router: IRouter = Router();

router.use(authRouter);
router.use(profileRouter);
router.use(analyzeRouter);
router.use(proTipsRouter);
router.use(healthRouter);
router.use(basesRouter);
router.use(blogRouter);
router.use(commentsRouter);
router.use(reportsRouter);
router.use(submissionsRouter);
router.use(analyticsRouter);
router.use(uploadRouter);

export default router;
