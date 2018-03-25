import TaskLoaderEvent from '../src/lib/event/TaskLoaderEvent';
import { expect } from 'chai';
import {} from 'mocha';

describe('#TaskLoaderEvent', () => {
  it('should clone itself', () => {
    const transitionEvent = new TaskLoaderEvent(TaskLoaderEvent.COMPLETE);
    expect(transitionEvent.clone()).to.deep.equal(transitionEvent);
  });
});
