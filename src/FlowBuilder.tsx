import React, { useContext, useRef, useState } from 'react';
import { FlowContext } from './FlowContext';
import MessageBlock from './MessageBlock';
import FlowChart from './FlowChart';
import ConfirmationModal from './ConfirmationModal';
import {Flow} from "./types"; // Make sure to create or import this component

const FlowBuilder: React.FC = () => {
    const flowContext = useContext(FlowContext);
    const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importedFlow, setImportedFlow] = useState<Flow | null>(null);

    if (!flowContext) {
        return null;
    }

    const { flow, addMessageBlock, importFlow, exportFlow } = flowContext;

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const content = e.target?.result as string;
            const newImportedFlow = JSON.parse(content);
            setImportedFlow(newImportedFlow);
            if (flow.steps.length) {
                setIsModalOpen(true);
            }
            else{
                importFlow(newImportedFlow);
                setImportedFlow(null);
            }

        };
        if (event.target.files?.length) {
            fileReader.readAsText(event.target.files[0]);
        }
    };

    const handleExport = () => {
        const json = JSON.stringify(exportFlow(), null, 2);
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

    const scrollToStep = (stepId?: string) => {
        if (stepId && stepRefs.current[stepId]) {
            stepRefs.current[stepId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="bg-gray-100 flex justify-center p-3 sm:p-14">
            {!!flow.steps.length && (
                <div className="p-4 bg-white shadow rounded mr-4 w-1/2 justify-center relative hidden sm:flex">
                    <FlowChart scrollToStep={scrollToStep} />
                </div>
            )}
            <div className="flex flex-col space-y-4 w-full sm:w-1/2">
                <div className="mb-1 flex justify-center">
                    <div className="mr-2">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            id="fileInput"
                            className='hidden'
                        />
                        <button
                            onClick={() => document?.getElementById('fileInput')?.click()}
                            className="p-2 bg-blue-500 text-white rounded"
                        >
                            Import JSON
                        </button>
                    </div>
                    <button
                        disabled={!flow.steps.length}
                        onClick={handleExport}
                        className={`p-2 bg-blue-500 mr-2 text-white rounded ${!flow.steps.length && 'opacity-80 cursor-not-allowed'}`}
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={addMessageBlock}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Add Step
                    </button>
                </div>
                {!!flow.steps.length ? flow.steps.map((step, index) => (
                    <div key={index} ref={el => (stepRefs.current[step.id] = el)} className="mb-4">
                        <MessageBlock step={step} scrollToStep={scrollToStep} flow={flow} />
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No steps yet. Add a step or import a flow to get started.
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    title="Delete current flow"
                    message="You are about to import a new flow, which will overwrite the current flow. Would you like to export the current flow before importing?"
                    onConfirm={handleConfirmImport}
                    onCancel={handleCancelImport}
                    onExport={handleExport}
                />
            )}
        </div>
    );
};

export default FlowBuilder;
