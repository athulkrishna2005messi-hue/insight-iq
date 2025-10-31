import { mockStore, mockCompany, type MockMember } from './datasource';
import type { MappedWhopEvent } from '../whop/eventMapper';

const processedEventIds = new Set<string>();

export function updateMockDatastore(event: MappedWhopEvent): { updated: boolean; memberId: string } {
  const eventId = event.eventId;
  
  if (processedEventIds.has(eventId)) {
    return { updated: false, memberId: event.memberId };
  }

  processedEventIds.add(eventId);

  const existingMemberIndex = mockStore.members.findIndex(m => m.memberId === event.memberId);

  const statusMap: Record<MappedWhopEvent['type'], 'active' | 'canceled' | 'refunded'> = {
    member_joined: 'active',
    member_renewed: 'active',
    member_canceled: 'canceled',
    member_refunded: 'refunded'
  };

  const whopStatus = statusMap[event.type];
  
  if (existingMemberIndex >= 0) {
    const existing = mockStore.members[existingMemberIndex];
    const updatedPlanIds = event.tier && !existing.planIds.includes(event.tier)
      ? [...existing.planIds, event.tier]
      : existing.planIds;
    
    mockStore.members[existingMemberIndex] = {
      ...existing,
      planIds: updatedPlanIds,
      whopPlanTier: event.tier || existing.whopPlanTier,
      whopStatus,
      whopLastEventType: event.type,
      whopLastEventTs: event.ts,
      whopRenewalDate: event.renewalDate || existing.whopRenewalDate
    };
  } else {
    const newMember: MockMember = {
      memberId: event.memberId,
      companyId: mockCompany.companyId,
      email: `${event.memberId}@whop.member`,
      displayName: `Whop Member ${event.memberId.substring(0, 8)}`,
      joinDate: event.ts,
      lastActiveAt: event.ts,
      lifetimeValue: 0,
      planIds: event.tier ? [event.tier] : [],
      engagementScore: 0.5,
      riskScore: 0.2,
      whopPlanTier: event.tier,
      whopStatus,
      whopLastEventType: event.type,
      whopLastEventTs: event.ts,
      whopRenewalDate: event.renewalDate
    };
    mockStore.members.push(newMember);
  }

  mockStore.events.push({
    eventId: eventId,
    memberId: event.memberId,
    companyId: mockCompany.companyId,
    type: event.type,
    metadata: event.raw,
    occurredAt: event.ts
  });

  return { updated: true, memberId: event.memberId };
}
