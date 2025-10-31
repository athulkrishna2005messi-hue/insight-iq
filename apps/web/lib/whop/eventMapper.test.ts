import { mapWhopEvent, type WhopWebhookEvent } from './eventMapper';

describe('mapWhopEvent', () => {
  it('maps purchase.created to member_joined', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_123',
      type: 'purchase.created',
      timestamp: '2025-03-15T10:30:00.000Z',
      data: {
        user_id: 'user_abc',
        tier: 'pro',
        renewal_date: '2025-04-15T10:30:00.000Z'
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.eventId).toBe('evt_123');
    expect(mapped.type).toBe('member_joined');
    expect(mapped.memberId).toBe('user_abc');
    expect(mapped.tier).toBe('pro');
    expect(mapped.renewalDate).toBe('2025-04-15T10:30:00.000Z');
    expect(mapped.ts).toBe('2025-03-15T10:30:00.000Z');
  });

  it('maps subscription.renewed to member_renewed', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_456',
      type: 'subscription.renewed',
      timestamp: '2025-03-16T10:30:00.000Z',
      data: {
        member_id: 'member_xyz',
        tier: 'enterprise',
        renewal_at: 1715769000
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.eventId).toBe('evt_456');
    expect(mapped.type).toBe('member_renewed');
    expect(mapped.memberId).toBe('member_xyz');
    expect(mapped.tier).toBe('enterprise');
    expect(mapped.renewalDate).toBeDefined();
    expect(mapped.ts).toBe('2025-03-16T10:30:00.000Z');
  });

  it('maps subscription.canceled to member_canceled', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_789',
      type: 'subscription.canceled',
      timestamp: '2025-03-17T10:30:00.000Z',
      data: {
        user_id: 'user_canceled',
        tier: 'basic'
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.eventId).toBe('evt_789');
    expect(mapped.type).toBe('member_canceled');
    expect(mapped.memberId).toBe('user_canceled');
    expect(mapped.tier).toBe('basic');
  });

  it('maps refund.issued to member_refunded', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_999',
      type: 'refund.issued',
      timestamp: '2025-03-18T10:30:00.000Z',
      data: {
        member_id: 'member_refund'
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.eventId).toBe('evt_999');
    expect(mapped.type).toBe('member_refunded');
    expect(mapped.memberId).toBe('member_refund');
  });

  it('resolves member ID from multiple field options', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_multi',
      type: 'purchase.created',
      timestamp: '2025-03-19T10:30:00.000Z',
      data: {
        membership_id: 'membership_123'
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.memberId).toBe('membership_123');
  });

  it('handles plan as object with id', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_plan',
      type: 'purchase.created',
      timestamp: '2025-03-19T10:30:00.000Z',
      data: {
        user_id: 'user_plan',
        plan: { id: 'plan_advanced', name: 'Advanced Plan' }
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.tier).toBe('plan_advanced');
  });

  it('falls back to unknown member ID when data is missing', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_fallback',
      type: 'purchase.created',
      timestamp: '2025-03-19T10:30:00.000Z',
      data: {}
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.memberId).toBe('unknown-evt_fallback');
  });

  it('defaults unknown event types to member_joined', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_unknown',
      type: 'some.unknown.type',
      timestamp: '2025-03-19T10:30:00.000Z',
      data: {
        user_id: 'user_unknown'
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.type).toBe('member_joined');
    expect(mapped.memberId).toBe('user_unknown');
  });

  it('handles epoch timestamp in seconds', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_epoch',
      type: 'purchase.created',
      timestamp: '2025-03-19T10:30:00.000Z',
      data: {
        user_id: 'user_epoch',
        renewal_date: 1715769000
      }
    };

    const mapped = mapWhopEvent(whopEvent);

    expect(mapped.renewalDate).toBeDefined();
    expect(mapped.renewalDate).toContain('2024');
  });

  it('provides stable output for the same event', () => {
    const whopEvent: WhopWebhookEvent = {
      id: 'evt_stable',
      type: 'purchase.created',
      timestamp: '2025-03-20T10:30:00.000Z',
      data: {
        user_id: 'user_stable',
        tier: 'standard'
      }
    };

    const mapped1 = mapWhopEvent(whopEvent);
    const mapped2 = mapWhopEvent(whopEvent);

    expect(mapped1).toEqual(mapped2);
  });
});
