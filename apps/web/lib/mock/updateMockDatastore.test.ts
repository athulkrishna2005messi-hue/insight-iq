import { updateMockDatastore } from './updateMockDatastore';
import { mockStore } from './datasource';
import type { MappedWhopEvent } from '../whop/eventMapper';

describe('updateMockDatastore', () => {
  const initialMemberCount = mockStore.members.length;
  const initialEventCount = mockStore.events.length;

  afterEach(() => {
    while (mockStore.members.length > initialMemberCount) {
      mockStore.members.pop();
    }
    while (mockStore.events.length > initialEventCount) {
      mockStore.events.pop();
    }
  });

  it('creates a new member on member_joined event', () => {
    const event: MappedWhopEvent = {
      eventId: 'test_evt_001',
      type: 'member_joined',
      memberId: 'test_member_001',
      tier: 'pro',
      renewalDate: '2025-04-20T10:00:00.000Z',
      ts: '2025-03-20T10:00:00.000Z',
      raw: { id: 'test_evt_001', type: 'purchase.created', data: {} }
    };

    const result = updateMockDatastore(event);

    expect(result.updated).toBe(true);
    expect(result.memberId).toBe('test_member_001');

    const newMember = mockStore.members.find(m => m.memberId === 'test_member_001');
    expect(newMember).toBeDefined();
    expect(newMember?.whopPlanTier).toBe('pro');
    expect(newMember?.whopStatus).toBe('active');
    expect(newMember?.whopLastEventType).toBe('member_joined');
    expect(newMember?.whopRenewalDate).toBe('2025-04-20T10:00:00.000Z');
  });

  it('updates existing member on member_renewed event', () => {
    const joinEvent: MappedWhopEvent = {
      eventId: 'test_evt_002',
      type: 'member_joined',
      memberId: 'test_member_002',
      tier: 'basic',
      ts: '2025-03-01T10:00:00.000Z',
      raw: { id: 'test_evt_002', type: 'purchase.created', data: {} }
    };
    updateMockDatastore(joinEvent);

    const renewEvent: MappedWhopEvent = {
      eventId: 'test_evt_003',
      type: 'member_renewed',
      memberId: 'test_member_002',
      tier: 'pro',
      renewalDate: '2025-05-01T10:00:00.000Z',
      ts: '2025-04-01T10:00:00.000Z',
      raw: { id: 'test_evt_003', type: 'subscription.renewed', data: {} }
    };
    const result = updateMockDatastore(renewEvent);

    expect(result.updated).toBe(true);
    const member = mockStore.members.find(m => m.memberId === 'test_member_002');
    expect(member?.whopPlanTier).toBe('pro');
    expect(member?.whopStatus).toBe('active');
    expect(member?.whopLastEventType).toBe('member_renewed');
    expect(member?.whopRenewalDate).toBe('2025-05-01T10:00:00.000Z');
  });

  it('updates member status to canceled on member_canceled event', () => {
    const joinEvent: MappedWhopEvent = {
      eventId: 'test_evt_004',
      type: 'member_joined',
      memberId: 'test_member_003',
      tier: 'enterprise',
      ts: '2025-02-01T10:00:00.000Z',
      raw: { id: 'test_evt_004', type: 'purchase.created', data: {} }
    };
    updateMockDatastore(joinEvent);

    const cancelEvent: MappedWhopEvent = {
      eventId: 'test_evt_005',
      type: 'member_canceled',
      memberId: 'test_member_003',
      tier: 'enterprise',
      ts: '2025-03-20T10:00:00.000Z',
      raw: { id: 'test_evt_005', type: 'subscription.canceled', data: {} }
    };
    updateMockDatastore(cancelEvent);

    const member = mockStore.members.find(m => m.memberId === 'test_member_003');
    expect(member?.whopStatus).toBe('canceled');
    expect(member?.whopLastEventType).toBe('member_canceled');
  });

  it('updates member status to refunded on member_refunded event', () => {
    const joinEvent: MappedWhopEvent = {
      eventId: 'test_evt_006',
      type: 'member_joined',
      memberId: 'test_member_004',
      tier: 'standard',
      ts: '2025-03-01T10:00:00.000Z',
      raw: { id: 'test_evt_006', type: 'purchase.created', data: {} }
    };
    updateMockDatastore(joinEvent);

    const refundEvent: MappedWhopEvent = {
      eventId: 'test_evt_007',
      type: 'member_refunded',
      memberId: 'test_member_004',
      ts: '2025-03-21T10:00:00.000Z',
      raw: { id: 'test_evt_007', type: 'refund.issued', data: {} }
    };
    updateMockDatastore(refundEvent);

    const member = mockStore.members.find(m => m.memberId === 'test_member_004');
    expect(member?.whopStatus).toBe('refunded');
    expect(member?.whopLastEventType).toBe('member_refunded');
  });

  it('prevents duplicate processing by event ID', () => {
    const event: MappedWhopEvent = {
      eventId: 'test_evt_008',
      type: 'member_joined',
      memberId: 'test_member_005',
      tier: 'pro',
      ts: '2025-03-22T10:00:00.000Z',
      raw: { id: 'test_evt_008', type: 'purchase.created', data: {} }
    };

    const result1 = updateMockDatastore(event);
    expect(result1.updated).toBe(true);

    const result2 = updateMockDatastore(event);
    expect(result2.updated).toBe(false);
    expect(result2.memberId).toBe('test_member_005');
  });

  it('adds event to mockStore.events', () => {
    const event: MappedWhopEvent = {
      eventId: 'test_evt_009',
      type: 'member_joined',
      memberId: 'test_member_006',
      tier: 'basic',
      ts: '2025-03-23T10:00:00.000Z',
      raw: { id: 'test_evt_009', type: 'purchase.created', data: {} }
    };

    const eventsBefore = mockStore.events.length;
    updateMockDatastore(event);
    const eventsAfter = mockStore.events.length;

    expect(eventsAfter).toBe(eventsBefore + 1);
    const addedEvent = mockStore.events[eventsAfter - 1];
    expect(addedEvent.eventId).toBe('test_evt_009');
    expect(addedEvent.type).toBe('member_joined');
    expect(addedEvent.memberId).toBe('test_member_006');
  });

  it('handles member updates without changing planIds', () => {
    const event: MappedWhopEvent = {
      eventId: 'test_evt_010',
      type: 'member_joined',
      memberId: 'test_member_007',
      tier: 'starter',
      ts: '2025-03-01T10:00:00.000Z',
      raw: { id: 'test_evt_010', type: 'purchase.created', data: {} }
    };
    updateMockDatastore(event);

    const member = mockStore.members.find(m => m.memberId === 'test_member_007');
    expect(member?.planIds).toEqual(['starter']);

    const updateEvent: MappedWhopEvent = {
      eventId: 'test_evt_011',
      type: 'member_renewed',
      memberId: 'test_member_007',
      tier: 'premium',
      ts: '2025-04-01T10:00:00.000Z',
      raw: { id: 'test_evt_011', type: 'subscription.renewed', data: {} }
    };
    updateMockDatastore(updateEvent);

    const updatedMember = mockStore.members.find(m => m.memberId === 'test_member_007');
    expect(updatedMember?.whopPlanTier).toBe('premium');
    expect(updatedMember?.planIds).toEqual(['starter', 'premium']);
  });
});
