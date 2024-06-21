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
  addStep: (id?: string) => string;
  updateStep: (oldId: string, key: string, value: string) => void;
  deleteStep: (id: string) => void;
  updateEvent: (
      stepId: string,
      eventId: string,
      newIntent: string,
      nextStepID: string,
  ) => void;
  deleteEvent: (stepId: string, eventId: string) => void;
  addEvent: (stepId: string) => void;
  importFlow: (importedFlow: Flow) => void;
  resetFlow: () => void;
  saveFlow: () => void;
}
