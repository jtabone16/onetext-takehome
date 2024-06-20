import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Flow, FlowContextProps, Event, Step } from './types';

export const FlowContext = createContext<FlowContextProps | undefined>(undefined);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [flow, setFlow] = useState<Flow>({
        initialStepID: '',
        steps: []
    });

    // Ensure initialStepID is always the first step's ID
    useEffect(() => {
        if (flow.steps.length > 0 && flow.initialStepID !== flow.steps[0].id) {
            setFlow({ ...flow, initialStepID: flow.steps[0].id });
        }
    }, [flow.steps]);

    const addMessageBlock = () => {
        const newStepNumber = flow.steps.length + 1;
        const newStep: Step = {
            id: `Step ${newStepNumber}`,
            type: 'message',
            message: '',
            events: []
        };
        const updatedSteps = [...flow.steps, newStep];
        setFlow({
            ...flow,
            steps: updatedSteps,
            initialStepID: updatedSteps[0].id // Update initialStepID
        });
    };

    const addMessageWithID = (id: string) => {
        const newStep: Step = {
            id,
            type: 'message',
            message: '',
            events: []
        };
        const updatedSteps = [...flow.steps, newStep];
        setFlow({
            ...flow,
            steps: updatedSteps,
            initialStepID: updatedSteps[0].id // Update initialStepID
        });
    };

    const updateMessageBlock = (oldId: string, key: string, value: string) => {
        let updatedSteps = flow.steps.map(step => {
            if (step.id === oldId) {
                return { ...step, [key]: value };
            }
            return step;
        });

        if (key === 'id') {
            updatedSteps = updatedSteps.map(step => {
                const updatedEvents = step.events?.map(event => {
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

    const deleteMessageBlock = (id: string) => {
        const updatedSteps = flow.steps.filter(step => step.id !== id);
        setFlow({
            ...flow,
            steps: updatedSteps,
            initialStepID: updatedSteps.length > 0 ? updatedSteps[0].id : '' // Update initialStepID
        });
    };

    const updateReply = (stepId: string, replyId: string, newIntent: string, nextStepID: string) => {
        const updatedSteps = flow.steps.map(step => {
            if (step.id === stepId) {
                const updatedEvents = step.events?.map(event =>
                    event.id === replyId ? { ...event, intent: newIntent, nextStepID } : event
                );
                return { ...step, events: updatedEvents };
            }
            return step;
        });
        setFlow({ ...flow, steps: updatedSteps });
    };

    const deleteReply = (stepId: string, replyId: string) => {
        const updatedSteps = flow.steps.map(step => {
            if (step.id === stepId) {
                const updatedEvents = step.events?.filter(event => event.id !== replyId);
                return { ...step, events: updatedEvents };
            }
            return step;
        });
        setFlow({ ...flow, steps: updatedSteps });
    };

    const addReply = (stepId: string) => {
        const updatedSteps = flow.steps.map(step => {
            if (step.id === stepId) {
                const newEvent: Event = { id: uuidv4(), type: 'reply', intent: '', nextStepID: '' };
                return { ...step, events: [...(step.events || []), newEvent] };
            }
            return step;
        });
        setFlow({ ...flow, steps: updatedSteps });
    };

    const importFlow = (importedFlow: Flow) => {
        //make sure if all events are assigned a uuid
        importedFlow.steps = importedFlow.steps.map(step => {
            const updatedEvents = step.events?.map(event => ({...event, id: uuidv4()}));
            return {...step, events: updatedEvents};
        });
        setFlow(importedFlow);
    };

    const exportFlow = (): Flow => {
        return flow;
    };

    return (
        <FlowContext.Provider
            value={{
                flow,
                addMessageBlock,
                addMessageWithID,
                updateMessageBlock,
                deleteMessageBlock,
                updateReply,
                deleteReply,
                addReply,
                importFlow,
                exportFlow
            }}
        >
            {children}
        </FlowContext.Provider>
    );
};
