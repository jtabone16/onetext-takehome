import React, { useContext } from 'react';
import { FlowContext } from './FlowContext';

const FlowChart: React.FC<{ scrollToStep: (stepId?: string) => void }> = ({ scrollToStep }) => {
    const flowContext = useContext(FlowContext);

    if (!flowContext) {
        return null;
    }

    const { flow } = flowContext;

    return (
        <div className="flow-chart">
            {flow.steps.map(step => (
                <div key={step.id} className="flow-chart-step">
                    <div className="step-bubble" onClick={() => scrollToStep(step.id)}>
                        {step.id}
                    </div>
                    {step.events.map(event => (
                        <div key={event.id} className="flow-chart-event">
                            <div className="event-line"></div>
                            <div className="event-bubble" onClick={() => scrollToStep(event.nextStepID)}>
                                {event.nextStepID}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default FlowChart;
