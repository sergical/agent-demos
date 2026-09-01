import { defineTool } from "eve/tools";
import { z } from "zod";
import { ddCheckoutUrl } from "../lib/dd";

export default defineTool({
  description:
    "Get the DoorDash checkout link for a personal cart so the person submits and pays for the order themselves. This is the last step of a personal order. The agent never submits an order.",
  inputSchema: z.object({
    cartUuid: z.string().min(1).describe("cartUuid from add_to_cart"),
    storeName: z.string().min(1),
    total: z.number().nullish().describe("total from preview_order, when it returned one"),
    currency: z.string().nullish().describe("currency from preview_order, e.g. CAD"),
  }),
  async execute({ cartUuid, storeName: _storeName, total: _total, currency: _currency }) {
    const url = await ddCheckoutUrl(cartUuid);
    if (!url) {
      return {
        ready: false,
        reason: "dd-cli returned no checkout URL for this cart.",
      };
    }

    return { ready: true, checkoutUrl: url };
  },
});
