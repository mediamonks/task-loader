import { AbstractEvent } from 'seng-event';
import { ITaskLoaderEventData } from '../interface/ITaskLoaderEventData';
declare class TaskLoaderEvent extends AbstractEvent {
    static START: string;
    static UPDATE: string;
    static COMPLETE: string;
    static FAILED: string;
    data: ITaskLoaderEventData;
    constructor(type: string, data?: ITaskLoaderEventData, bubbles?: boolean, cancelable?: boolean, setTimeStamp?: boolean);
    clone(): TaskLoaderEvent;
}
export default TaskLoaderEvent;
