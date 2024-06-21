import React, { useContext, useRef, useState } from 'react';
import { FlowContext } from './FlowContext';
import StepContainer from './StepContainer';
import FlowChart from './FlowChart';
import ConfirmationModal from './ConfirmationModal';
import { Flow } from './types';

const FlowBuilder: React.FC = () => {
  const flowContext = useContext(FlowContext);
  const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importedFlow, setImportedFlow] = useState<Flow | null>(null);
  const [modalType, setModalType] = useState<string | null>(null);

  if (!flowContext) {
    return null;
  }

  const { flow, addStep, importFlow, resetFlow, saveFlow } = flowContext;

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const content = e.target?.result as string;
      const newImportedFlow = JSON.parse(content);
      setImportedFlow(newImportedFlow);
      if (flow.steps.length) {
        setModalType('import');
        setIsModalOpen(true);
      } else {
        importFlow(newImportedFlow);
        setImportedFlow(null);
      }
    };
    if (event.target.files?.length) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(flow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.initialStepID}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (importedFlow) {
      importFlow(importedFlow);
      setImportedFlow(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelImport = () => {
    setImportedFlow(null);
    setIsModalOpen(false);
  };

  const handleAddStep = () => {
    const newStepId = addStep();
    setTimeout(() => scrollToStep(newStepId), 100); // Scroll to the newly added step
  };

  const handleResetFlow = () => {
    setModalType('reset');
    setIsModalOpen(true);
  };

  const handleSaveFlow = () => {
    setModalType('save');
    setIsModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetFlow();
    setIsModalOpen(false);
  };

  const handleConfirmSave = () => {
    saveFlow();
    setIsModalOpen(false);
  };

  const scrollToStep = (stepId?: string) => {
    if (stepId && stepRefs.current[stepId]) {
      stepRefs.current[stepId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
      <div className={`bg-gray-100 flex flex-col items-center pb-3 px-3 sm:pb-14 sm:px-14 ${!flow.steps.length && 'sm:pb-2'}`}>
        <div className="sticky rounded top-0 bg-gray-100 p-2 w-full z-10 my-4">
          <div className="flex justify-center gap-2">
            <div>
              <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  id="fileInput"
                  className="hidden"
              />
              <button
                  onClick={() => document?.getElementById('fileInput')?.click()}
                  className="p-2 bg-blue-500 text-white rounded transition-transform transform hover:scale-105"
              >
                Import JSON
              </button>
            </div>
            <button
                onClick={handleAddStep}
                className="p-2 bg-blue-500 text-white rounded transition-transform transform hover:scale-105"
            >
              Add Step
            </button>
            <button
                disabled={!flow.steps.length}
                onClick={handleResetFlow}
                className={`ml-4 p-2 bg-red-500 text-white rounded transition-transform transform hover:scale-105 ${!flow.steps.length && 'opacity-80 cursor-not-allowed'}`}
            >
              Reset Flow
            </button>
            <button
                disabled={!flow.steps.length}
                onClick={handleSaveFlow}
                className={`p-2 bg-green-500 text-white rounded transition-transform transform hover:scale-105 ${!flow.steps.length && 'opacity-80 cursor-not-allowed'}`}
            >
              Save Flow
            </button>
          </div>
        </div>
        {!flow.steps.length ? (
            <div className="text-gray-500 transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in">
              No steps yet. Add a step or import a flow to get started!
            </div>
        ) : (
            <div className="flex flex-col sm:flex-row w-full transition-transform transform duration-500 ease-in-out">
              <div className="p-4 bg-white shadow rounded mr-4 w-full sm:w-1/3 justify-center relative hidden sm:flex">
                <FlowChart scrollToStep={scrollToStep} />
              </div>
              <div className="space-y-4 w-full sm:w-2/3">
                {flow.steps.map((step, index) => (
                    <div
                        key={index}
                        ref={(el) => (stepRefs.current[step.id] = el)}
                        className="mb-4 transition-transform transform duration-500 ease-in-out"
                    >
                      <StepContainer
                          step={step}
                          scrollToStep={scrollToStep}
                          flow={flow}
                      />
                    </div>
                ))}
              </div>
            </div>
        )}

        {isModalOpen && (
            <ConfirmationModal
                isOpen={isModalOpen}
                title={
                  modalType === 'import'
                      ? 'Delete flow'
                      : modalType === 'reset'
                          ? 'Reset flow'
                          : 'Save flow'
                }
                message={
                  modalType === 'import'
                      ? 'You are about to import a new flow, which will overwrite the current flow. Click Export to save the current flow before importing.'
                      : modalType === 'reset'
                          ? 'Are you sure you want to reset the current flow? This action cannot be undone. Click Export to save the current flow before resetting.'
                          : 'Save the current flow to local storage? You can also export it by clicking the Export button'
                }
                onConfirm={
                  modalType === 'import'
                      ? handleConfirmImport
                      : modalType === 'reset'
                          ? handleConfirmReset
                          : handleConfirmSave
                }
                onCancel={handleCancelImport}
                onExport={handleExport}
                confirmButtonColor={
                  modalType === 'reset' ? 'bg-red-500' : modalType === 'save' ? 'bg-green-500' : 'bg-blue-500'
                }
            />
        )}
      </div>
  );
};

export default FlowBuilder;
