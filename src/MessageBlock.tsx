import React, { useState, useContext, useEffect, useRef } from 'react';
import { FlowContext } from './FlowContext';
import { Step, Event as EventType } from './types';
import ReplyForm from './ReplyForm';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface MessageBlockProps {
    step: Step;
    scrollToStep: (stepId?: string) => void;
    flow: {
        steps: Step[];
    };
}

const MessageBlock: React.FC<MessageBlockProps> = ({ step, scrollToStep, flow }) => {
    const flowContext = useContext(FlowContext);
    const [stepName, setStepName] = useState(step.id);
    const [message, setMessage] = useState(step.message);

    const { updateMessageBlock, deleteMessageBlock, addReply } = flowContext!;

    const latestStepName = useRef(step.id);
    const latestMessage = useRef(step.message);

    useEffect(() => {
        setStepName(step.id);
        latestStepName.current = step.id;
    }, [step.id]);

    useEffect(() => {
        setMessage(step.message);
        latestMessage.current = step.message;
    }, [step.message]);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSave = () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (latestStepName.current !== stepName) {
                updateMessageBlock(step.id, 'id', stepName);
                latestStepName.current = stepName;
            }
            if (latestMessage.current !== message) {
                updateMessageBlock(step.id, 'message', message);
                latestMessage.current = message;
            }
        }, 300);
    };

    const handleAddReply = () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            addReply(step.id);
        }, 0);
    };

    const relatedReplies = flow.steps.flatMap((s: Step) =>
        s.events.filter((event: EventType) => event.nextStepID === step.id)
            .map((event: EventType) => ({ ...event, parentStepId: s.id }))
    );

    useEffect(() => {
        setStepName(step.id);
        setMessage(step.message);
    }, [step.id, step.message]);

    return (
        <div className="flex flex-col message-block p-4 mb-4 bg-white shadow rounded relative">
            <XCircleIcon
                onClick={() => deleteMessageBlock(step.id)}
                className="x-circle-icon"
            />
            <div className="related-replies">
                {relatedReplies.map((event, index) => (
                    <div key={index} className="text-sm text-white mb-2">
                        <button
                            onClick={() => scrollToStep(event.parentStepId)}
                            className="font-bold text-blue-500 hover:underline"
                        >
                            Triggered when the user...{event.intent}
                        </button>
                    </div>
                ))}
            </div>
            <div className="bubble bubble-right relative">
                <label className="text-sm font-bold mb-1 text-white">Step name</label>
                <input
                    type="text"
                    value={stepName}
                    onChange={e => setStepName(e.target.value)}
                    onBlur={handleSave}
                    className="border p-2 w-full mb-2 bg-transparent placeholder-white text-white"
                    placeholder="Greetings, Choose Toppings, etc."
                />
                <label className="text-sm font-bold mb-1 text-white">Step message</label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onBlur={handleSave}
                    className="border p-2 w-full mb-2 bg-transparent placeholder-white text-white"
                    placeholder="Want a pizza?, What toppings?, etc."
                />
            </div>
            <div className="replies mt-4">
                {step.events.map((event: EventType) => (
                    <ReplyForm key={event.id} event={event} stepId={step.id} scrollToStep={scrollToStep}/>
                ))}
            </div>

            <button onClick={handleAddReply}
                    className="add-reply-button mt-2 p-1 bg-blue-500 text-white rounded self-end">
                Add Reply
            </button>
        </div>
    );
};

export default MessageBlock;
