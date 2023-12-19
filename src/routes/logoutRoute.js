import { logoutController } from "../controller/logoutController.js";

export const logoutRoute = [
    {
        method: 'GET',
        path: '/logout',
        handler: logoutController.logout
    }
]