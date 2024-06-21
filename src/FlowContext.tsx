import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Flow, FlowContextProps, Event, Step } from './types';

export const FlowContext = createContext<FlowContextProps | undefined>(undefined);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flow, setFlow] = useState<Flow>({
    initialStepID: '',
    steps: [],
  });

  // Load flow from local storage on mount
  useEffect(() => {
    const savedFlow = localStorage.getItem('savedFlow');
    if (savedFlow) {
      setFlow(JSON.parse(savedFlow));
    }
  }, []);

  // Ensure initialStepID is always the first step's ID
  useEffect(() => {
    if (flow.steps.length > 0 && flow.initialStepID !== flow.steps[0].id) {
      setFlow({ ...flow, initialStepID: flow.steps[0].id });
    }
  }, [flow.steps, flow.initialStepID]);

  const addStep = (id?: string) => {
    const newStep: Step = {
      id: id || `Step ${flow.steps.length + 1}`,
      type: 'message',
      message: '',
      events: [],
    };
    const updatedSteps = [...flow.steps, newStep];
    setFlow({
      ...flow,
      steps: updatedSteps,
      initialStepID: updatedSteps[0].id, // Update initialStepID
    });
    return newStep.id;
  };

  const updateStep = (oldId: string, key: string, value: string) => {
    let updatedSteps = flow.steps.map((step) => {
      if (step.id === oldId) {
        return { ...step, [key]: value };
      }
      return step;
    });

    if (key === 'id') {
      updatedSteps = updatedSteps.map((step) => {
        const updatedEvents = step.events?.map((event) => {
          if (event.nextStepID === oldId) {
            return { ...event, nextStepID: value };
          }
          return event;
        });
        return { ...step, events: updatedEvents };
      });
    }

    setFlow({ ...flow, steps: updatedSteps });
  };

  const deleteStep = (id: string) => {
    const updatedSteps = flow.steps.filter((step) => step.id !== id);
    setFlow({
      ...flow,
      steps: updatedSteps,
      initialStepID: updatedSteps.length > 0 ? updatedSteps[0].id : '', // Update initialStepID
    });
  };

  const updateEvent = (
      stepId: string,
      eventId: string,
      newIntent: string,
      nextStepID: string,
  ) => {
    const updatedSteps = flow.steps.map((step) => {
      if (step.id === stepId) {
        const updatedEvents = step.events?.map((event) =>
            event.id === eventId
                ? { ...event, intent: newIntent, nextStepID }
                : event,
        );
        return { ...step, events: updatedEvents };
      }
      return step;
    });
    setFlow({ ...flow, steps: updatedSteps });
  };

  const deleteEvent = (stepId: string, eventId: string) => {
    const updatedSteps = flow.steps.map((step) => {
      if (step.id === stepId) {
        const updatedEvents = step.events?.filter(
            (event) => event.id !== eventId,
        );
        return { ...step, events: updatedEvents };
      }
      return step;
    });
    setFlow({ ...flow, steps: updatedSteps });
  };

  const addEvent = (stepId: string) => {
    const updatedSteps = flow.steps.map((step) => {
      if (step.id === stepId) {
        const newEvent: Event = {
          id: uuidv4(),
          type: 'reply',
          intent: '',
          nextStepID: '',
        };
        return { ...step, events: [...(step.events || []), newEvent] };
      }
      return step;
    });
    setFlow({ ...flow, steps: updatedSteps });
  };

  const importFlow = (importedFlow: Flow) => {
    //make sure if all events are assigned a uuid
    importedFlow.steps = importedFlow.steps.map((step) => {
      const updatedEvents = step.events?.map((event) => ({
        ...event,
        id: uuidv4(),
      }));
      return { ...step, events: updatedEvents };
    });
    setFlow(importedFlow);
  };

  const resetFlow = () => {
    setFlow({
      initialStepID: '',
      steps: [],
    });
    localStorage.removeItem('savedFlow');
  };

  const saveFlow = () => {
    localStorage.setItem('savedFlow', JSON.stringify(flow));
  };

  return (
      <FlowContext.Provider
          value={{
            flow,
            addStep,
            updateStep,
            deleteStep,
            updateEvent,
            deleteEvent,
            addEvent,
            importFlow,
            resetFlow,
            saveFlow,
          }}
      >
        {children}
      </FlowContext.Provider>
  );
};
