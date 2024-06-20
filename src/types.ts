export interface Event {
    id: string;
    type: string;
    intent: string;
    nextStepID: string;
    key?: string;
}

export interface Step {
    id: string;
    type: string;
    message: string;
    events?: Event[];
}

export interface Flow {
    initialStepID: string;
    steps: Step[];
}

export interface FlowContextProps {
    flow: Flow;
    addMessageBlock: () => void;
    addMessageWithID: (id: string) => void;
    updateMessageBlock: (oldId: string, key: string, value: string) => void;
    deleteMessageBlock: (id: string) => void;
    updateReply: (stepId: string, replyId: string, newIntent: string, nextStepID: string) => void;
    deleteReply: (stepId: string, replyId: string) => void;
    addReply: (stepId: string) => void;
    importFlow: (importedFlow: Flow) => void;
    exportFlow: () => Flow;
}
