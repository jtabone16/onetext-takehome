import React, { useState, useContext, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { FlowContext } from './FlowContext';
import { Event } from './types';
import { XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface ReplyFormProps {
    event: Event;
    stepId: string;
    scrollToStep: (stepId?: string) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ event, stepId, scrollToStep }) => {
    const flowContext = useContext(FlowContext);
    const [intent, setIntent] = useState(event.intent || '');
    const [nextStepID, setNextStepID] = useState(event.nextStepID);

    useEffect(() => {
        setNextStepID(event.nextStepID);
        setIntent(event.intent);
    }, [event.nextStepID, event.intent]);

    useEffect(() => {
        if (flowContext) {
            flowContext.updateReply(stepId, event.id, intent, nextStepID);
        }
    }, [nextStepID]);

    if (!flowContext) {
        return null;
    }

    const { flow, updateReply, deleteReply, addMessageWithID } = flowContext;

    const handleSave = () => {
        updateReply(stepId, event.id, intent, nextStepID);
    };

    const handleAddMessage = (id: string) => {
        if (id && !flow.steps.find(step => step.id === id)) {
            addMessageWithID(id);
        }
    };

    const stepOptions = flow.steps
        .filter(step => step.id !== stepId)
        .map(step => ({
            value: step.id,
            label: step.id,
        }));

    const selectedOption = stepOptions.find(option => option.value === nextStepID);

    const handleChange = (newValue: any) => {
        const value = newValue ? newValue.value : '';
        if (value !== nextStepID) {
            setNextStepID(value);
        }
    };

    const handleCreate = (inputValue: string) => {
        if (inputValue !== nextStepID) {
            setNextStepID(inputValue);
            handleAddMessage(inputValue);
        }
    };

    return (
        <div className="reply-form mt-2 bubble bubble-left relative">
            <label className="text-sm font-bold mb-1 text-black">When the user...</label>
            <input
                type="text"
                value={intent}
                onChange={e => setIntent(e.target.value)}
                onBlur={handleSave}
                className="border border-black p-2 w-full mb-2 bg-transparent placeholder-opacity-50 text-black"
                placeholder="Says yes, Chooses toppings, etc."
            />
            <label className="text-sm font-bold mb-1 text-black">
                ...then trigger {' '}
                {nextStepID ? (
                    <button
                        onClick={() => scrollToStep(nextStepID)}
                        className="font-bold text-blue-500 hover:underline"
                    >
                        this step
                    </button>
                ) : (
                    'this step'
                )}
            </label>
            <div className="flex items-center border border-black p-2 w-full mb-2 bg-transparent">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2"/>
                <CreatableSelect
                    options={stepOptions}
                    value={selectedOption}
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    placeholder="Find or add step"
                    classNamePrefix="react-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            border: 'none',
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                            color: 'black',
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: 'black',
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: 'black',
                            opacity: 0.5,
                        }),
                        container: (provided) => ({
                            ...provided,
                            flex: 1,
                        }),
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 10,
                        }),
                    }}
                />
            </div>
            <XCircleIcon
                onClick={() => deleteReply(stepId, event.id)}
                className="h-6 w-6 text-red-500 absolute -top-2.5 -right-2 cursor-pointer"
            />
        </div>
    );
};

export default ReplyForm;
