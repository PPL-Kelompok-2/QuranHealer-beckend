import { Ustadzs } from "../../model/Data.js";

export const ustadzController = {
  async listUstadz(request, h) {
    try {
      const result = await Ustadzs.listUstadz();
      return h.response({ result }).code(200);
    } catch (error) {
      return h.response({ error: error.message }); //.code(400);
    }
  },
};
