import type { FulfillmentState } from "@/app/dog/[id]/home/types";

export type GetFulfillmentResponse =
  | { data: FulfillmentState }
  | { error: string };
