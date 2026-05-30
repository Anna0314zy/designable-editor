import { ICustomEvent } from "@editor/shared";
import { AbstractMutationNodeEvent } from "./AbstractMutationNodeEvent";

export class UnMakeGroupNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = "group:unmake";
}
