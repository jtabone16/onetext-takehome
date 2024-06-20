import React, { useContext, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { FlowContext } from './FlowContext';
import { Step, Event as EventType } from './types';

const FlowChart: React.FC<{ scrollToStep: (stepId?: string) => void }> = ({ scrollToStep }) => {
    const flowContext = useContext(FlowContext);
    const flow = flowContext?.flow;

    const [treeData, setTreeData] = useState<any[]>([]);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (flow) {
            const generateTree = (stepId: string, visited: Set<string>): any => {
                if (visited.has(stepId)) {
                    return null; // Circular dependency detected, stop recursion
                }

                visited.add(stepId);

                const step = flow.steps.find(s => s.id === stepId);
                if (!step) return null;

                const children = step.events?.map(event => generateTree(event.nextStepID, new Set(visited))).filter(Boolean) || [];
                return {
                    name: step.id,
                    children,
                };
            };

            const rootStep = flow.steps.find(s => s.id === flow.initialStepID);
            if (rootStep) {
                const treeStructure = generateTree(rootStep.id, new Set());
                if (treeStructure) {
                    setTreeData([treeStructure]);
                    // Calculate the initial position to center the tree
                    const dimensions = document.getElementById('treeWrapper')?.getBoundingClientRect();
                    if (dimensions) {
                        setTranslate({
                            x: dimensions.width / 2,
                            y: dimensions.height / 4,
                        });
                    }
                } else {
                    setTreeData([]);
                }
            }
        }
    }, [flow]);

    const renderNode = ({ nodeDatum }: any) => (
        <g onClick={() => scrollToStep(nodeDatum.name)}>
            <rect
                x="-60"
                y="-30"
                width="120"
                height="60"
                rx="30"
                fill="#007AFF"
                stroke="#007AFF"
                strokeWidth="2"
            />
            <text fill="white" x="0" y="0" textAnchor="middle" fontSize="12" stroke="none">
                {nodeDatum.name}
            </text>
        </g>
    );

    return (
        <div id="treeWrapper" style={{ width: '100%', height: '800px' }}>
            {treeData.length > 0 ? (
                <Tree
                    data={treeData}
                    renderCustomNodeElement={renderNode}
                    orientation="vertical"
                    pathFunc="step"
                    translate={translate}
                />
            ) : (
                <p>No data to display</p>
            )}
        </div>
    );
};

export default FlowChart;
