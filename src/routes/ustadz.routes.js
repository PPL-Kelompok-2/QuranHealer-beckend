import { ustadzController } from "../controller/ustadz.controller.js";

export const ustadzRoutes = [
  {
    method: "GET",
    path: "/ustadz",
    handler: ustadzController.listUstadz,
  },
];
