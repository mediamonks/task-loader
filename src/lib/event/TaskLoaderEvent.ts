import { AbstractEvent } from 'seng-event';
import { generateEventTypes, EVENT_TYPE_PLACEHOLDER } from 'seng-event/lib/util/eventTypeUtils';
import ITaskLoaderEventData from '../interface/ITaskLoaderEventData';

class TaskLoaderEvent extends AbstractEvent {
  public static START: string = EVENT_TYPE_PLACEHOLDER;
  public static UPDATE: string = EVENT_TYPE_PLACEHOLDER;
  public static COMPLETE: string = EVENT_TYPE_PLACEHOLDER;
  public static FAILED: string = EVENT_TYPE_PLACEHOLDER;

  public data: ITaskLoaderEventData;

  constructor(
    type: string,
    data?: ITaskLoaderEventData,
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);
    this.data = data;
  }

  public clone(): TaskLoaderEvent {
    return new TaskLoaderEvent(this.type, this.data, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ TaskLoaderEvent });

export default TaskLoaderEvent;
