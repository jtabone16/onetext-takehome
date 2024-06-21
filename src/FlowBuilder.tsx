import React, { useContext, useRef } from 'react';
import { FlowContext } from './FlowContext';
import MessageBlock from './MessageBlock';
import FlowChart from './FlowChart';

const FlowBuilder: React.FC = () => {
    const flowContext = useContext(FlowContext);
    const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    if (!flowContext) {
        return null;
    }

    const { flow, addMessageBlock, importFlow, exportFlow } = flowContext;

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const content = e.target?.result as string;
            const importedFlow = JSON.parse(content);
            importFlow(importedFlow);
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
        link.download = 'flow.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const scrollToStep = (stepId?: string) => {
        if (stepId && stepRefs.current[stepId]) {
            stepRefs.current[stepId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="flow-builder">
            <div className="flow-chart-container p-4 bg-white shadow rounded mr-4 w-1/2">
                <FlowChart scrollToStep={scrollToStep} />
            </div>
            <div className="message-block-container flex flex-col space-y-4 w-1/2">
                <div className="controls mb-4">
                    <input type="file" accept=".json" onChange={handleImport} className="mr-2" />
                    <button onClick={handleExport} className="export-button mr-2 p-2 bg-green-500 text-white rounded">
                        Export JSON
                    </button>
                    <button onClick={addMessageBlock} className="add-message-button p-2 bg-blue-500 text-white rounded">
                        Add Step
                    </button>
                </div>
                {flow.steps.map((step, index) => (
                    <div key={index} ref={el => (stepRefs.current[step.id] = el)} className="mb-4">
                        <MessageBlock step={step} scrollToStep={scrollToStep} flow={flow} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlowBuilder;
