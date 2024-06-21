import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { FlowContext } from './FlowContext';
import { Step, Event as EventType } from './types';
import EventForm from './EventForm';
import { XCircleIcon } from '@heroicons/react/24/solid';
import ConfirmationModal from './ConfirmationModal';

interface StepContainerProps {
  step: Step;
  scrollToStep: (stepId?: string) => void;
  flow: {
    steps: Step[];
  };
}

const StepContainer: React.FC<StepContainerProps> = ({
  step,
  scrollToStep,
  flow,
}) => {
  const flowContext = useContext(FlowContext);
  const [stepName, setStepName] = useState(step.id);
  const [message, setMessage] = useState(step.message);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateStep, deleteStep, addEvent } = flowContext!;

  const latestStepName = useRef(step.id);
  const latestMessage = useRef(step.message);

  const relatedReplies = useMemo(
    () =>
      flow.steps.flatMap(
        (s: Step) =>
          s.events
            ?.filter((event: EventType) => event.nextStepID === step.id)
            .map((event: EventType) => ({ ...event, parentStepId: s.id })) ||
          [],
      ),
    [flow.steps, step.id],
  );

  const confirmationModalContent = useMemo(
    () =>
      relatedReplies.length ? (
        <li className="text-sm">
          {relatedReplies.map((event) => event.intent)}
        </li>
      ) : undefined,
    [relatedReplies],
  );

  useEffect(() => {
    setStepName(step.id);
    latestStepName.current = step.id;
  }, [step.id, latestStepName]);

  useEffect(() => {
    setMessage(step.message);
    latestMessage.current = step.message;
  }, [step.message, latestMessage]);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSave = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (latestStepName.current !== stepName) {
        // Validate uniqueness of the step ID
        if (flow.steps.some((s) => s.id === stepName && s.id !== step.id)) {
          setError('Step name must be unique');
        } else {
          updateStep(step.id, 'id', stepName);
          latestStepName.current = stepName;
          setError(null);
        }
      }
      if (latestMessage.current !== message) {
        updateStep(step.id, 'message', message);
        latestMessage.current = message;
      }
    }, 300);
  };

  const handleAddEvent = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      addEvent(step.id);
    }, 0);
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    deleteStep(step.id);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setStepName(step.id);
    setMessage(step.message);
  }, [step.id, step.message]);

  return (
    <div className="flex flex-col message-block p-4 mb-4 bg-white shadow rounded relative">
      <XCircleIcon
        onClick={handleDelete}
        className="h-6 w-6 text-red-500 absolute -top-2.5 -right-2 cursor-pointer"
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Step"
        message={`Are you sure you want to delete this step? ${relatedReplies.length > 0 ? 'This step is being triggered by the following replies: ' : ''}`}
        content={confirmationModalContent}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      {relatedReplies.length > 0 && (
        <div className="related-replies">
          <label className="text-sm font-bold mb-4">Triggered when...</label>
          {relatedReplies.map(
            (event) =>
              event.intent && (
                <div key={event.id} className="text-sm text-white mb-2">
                  <button
                    onClick={() => scrollToStep(event.parentStepId)}
                    className="font-bold text-blue-500 hover:underline"
                  >
                    {event.intent}
                  </button>
                </div>
              ),
          )}
        </div>
      )}
      <div className="bubble bubble-right">
        <label className="text-sm font-bold mb-1">Step name</label>
        <input
          type="text"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
          onBlur={handleSave}
          className="border p-2 w-full mb-2 bg-transparent"
          placeholder="Greetings, Choose Toppings, etc."
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <label className="text-sm font-bold mb-1">Step message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={handleSave}
          className="border p-2 w-full mb-2 bg-transparent"
          placeholder="Want a pizza?, What toppings?, etc."
        />
      </div>
      <div className="replies mt-4">
        {step.events?.map((event: EventType) => (
          <EventForm
            key={event.id}
            event={event}
            stepId={step.id}
            scrollToStep={scrollToStep}
          />
        ))}
      </div>

      <button
        onClick={handleAddEvent}
        className="text-white rounded mt-2 p-2 bg-green-500 self-end"
      >
        Add Event
      </button>
    </div>
  );
};

export default StepContainer;
