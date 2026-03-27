import type { ActionCategory, ActionLog } from "@/app/dog/[id]/home/types";

export interface LogActionRequest {
  category: ActionCategory;
  itemName: string;
}

export type LogActionResponse = { data: ActionLog } | { error: string };

export type GetActionsResponse = { data: ActionLog[] } | { error: string };
