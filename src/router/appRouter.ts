import { App_url } from "../common/constant";
import { authRoutes } from "../routes/authRoutes";

const appRouter = (app: any)=>{
    app.use(authRoutes);
}
export default appRouter;