import React, { useContext, useEffect, useRef } from 'react';
import { FlowContext } from './FlowContext';

const FlowChart: React.FC<{ scrollToStep: (stepId?: string) => void }> = ({ scrollToStep }) => {
    const flowContext = useContext(FlowContext);
    const containerRef = useRef<HTMLDivElement>(null);

    const flow = flowContext?.flow;

    useEffect(() => {
        if (containerRef.current && flow && flow.steps) {
            const container = containerRef.current;
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "flow-chart-lines");
            container.appendChild(svg);

            flow.steps.forEach(step => {
                step.events?.forEach(event => {
                    if (event.nextStepID) {
                        const startElement = document.getElementById(`reply-${event.id}`);
                        const endElement = document.getElementById(`step-${event.nextStepID}`);
                        if (startElement && endElement) {
                            const startRect = startElement.getBoundingClientRect();
                            const endRect = endElement.getBoundingClientRect();

                            const startX = startRect.left + startRect.width / 2 - container.getBoundingClientRect().left;
                            const startY = startRect.top + startRect.height / 2 - container.getBoundingClientRect().top;
                            const endX = endRect.left + endRect.width / 2 - container.getBoundingClientRect().left;
                            const endY = endRect.top + endRect.height / 2 - container.getBoundingClientRect().top;

                            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                            line.setAttribute("x1", startX.toString());
                            line.setAttribute("y1", startY.toString());
                            line.setAttribute("x2", endX.toString());
                            line.setAttribute("y2", endY.toString());
                            line.setAttribute("stroke", "black");
                            line.setAttribute("stroke-width", "2");

                            svg.appendChild(line);
                        }
                    }
                });
            });

            return () => {
                container.removeChild(svg);
            };
        }
    }, [flow]);

    if (!flowContext || !flow || !flow.steps) {
        return null;
    }

    return (
        <div className="flow-chart-container" ref={containerRef}>
            <div className="flow-chart">
                {flow.steps.map(step => (
                    <div key={step.id} className="flow-chart-step" id={`step-${step.id}`}>
                        <div className="step-bubble" onClick={() => scrollToStep(step.id)}>
                            {step.id}
                        </div>
                        <div className="flow-chart-replies">
                            {step.events?.map(event => (
                                <div key={event.id} className="flow-chart-event" id={`reply-${event.id}`}>
                                    <div className="event-line"></div>
                                    <div className="event-bubble" onClick={() => scrollToStep(event?.nextStepID)}>
                                        {event?.intent}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlowChart;
