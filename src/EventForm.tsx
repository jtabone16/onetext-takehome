import React, { useState, useContext, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { FlowContext } from './FlowContext';
import { Event } from './types';
import { XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import ConfirmationModal from './ConfirmationModal';

interface EventFormProps {
  event: Event;
  stepId: string;
  scrollToStep: (stepId?: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  stepId,
  scrollToStep,
}) => {
  const flowContext = useContext(FlowContext);
  const [intent, setIntent] = useState(event.intent || '');
  const [nextStepID, setNextStepID] = useState(event.nextStepID);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setNextStepID(event.nextStepID);
    setIntent(event.intent);
  }, [event.nextStepID, event.intent]);

  useEffect(() => {
    if (flowContext) {
      flowContext.updateEvent(stepId, event.id, intent, nextStepID);
    }
  }, [stepId, event.id, intent, nextStepID, flowContext]);

  if (!flowContext) {
    return null;
  }

  const { flow, updateEvent, deleteEvent, addStep } = flowContext;

  const handleSave = () => {
    updateEvent(stepId, event.id, intent, nextStepID);
  };

  const handleAddStep = (id: string) => {
    if (id && !flow.steps.find((step) => step.id === id)) {
      addStep(id);
    }
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    deleteEvent(stepId, event.id);
    setIsModalOpen(false);
  };

  const stepOptions = flow.steps
    .filter((step) => step.id !== stepId)
    .map((step) => ({
      value: step.id,
      label: step.id,
    }));

  const selectedOption = stepOptions.find(
    (option) => option.value === nextStepID,
  );

  const handleChange = (newValue: any) => {
    const value = newValue ? newValue.value : '';
    if (value !== nextStepID) {
      setNextStepID(value);
    }
  };

  const handleCreate = (inputValue: string) => {
    if (inputValue !== nextStepID) {
      setNextStepID(inputValue);
      handleAddStep(inputValue);
    }
  };

  return (
    <div className="bubble bubble-left">
      <label className="text-sm font-bold mb-1 text-black">When...</label>
      <input
        type="text"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        onBlur={handleSave}
        className="border border-black p-2 w-full mb-2 bg-transparent placeholder-opacity-50 text-black"
        placeholder="Says yes, Chooses toppings, etc."
      />
      <label className="text-sm font-bold mb-1 text-black">
        ...then trigger{' '}
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
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
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
        onClick={handleDelete}
        className="h-6 w-6 text-red-500 absolute -top-2.5 -right-2 cursor-pointer"
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Event"
        message={`Are you sure you want to delete this event? ${nextStepID ? 'This event triggers:' : ''}`}
        content={
          nextStepID ? (
            <p className="text-sm font-bold">{nextStepID}</p>
          ) : undefined
        }
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EventForm;
