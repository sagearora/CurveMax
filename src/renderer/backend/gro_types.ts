export interface Correspondence {
    id: string;
    url: string;
}

export interface ContextResource {
    id: string;
    url: string;
}

export interface Recipient {
    id: string;
    url: string;
}

export interface Campaign {
    id: string;
    url: string;
}

export interface ConversationEntry {
    self: string;
    kind: string;
    id: string;
    conversationId: string;
    type: string;
    direction: 'Outgoing' | 'Incoming';
    messageId: string;
    recipientName: string;
    recipient: Recipient;
    externalCorrespondent: string;
    internalCorrespondent: string;
    content: string;
    templateId: string;
    correspondences: Correspondence[];
    context: string;
    contextResources: ContextResource[];
    appointment: null;
    changedAt: string;
    status: string;
    reasonForFailure: null;
    createdAt: string;
    user: null;
    campaign: Campaign;
    createdByUserId: null;
}