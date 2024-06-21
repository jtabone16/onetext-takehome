import React, { useContext, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { FlowContext } from './FlowContext';

const FlowChart: React.FC<{ scrollToStep: (stepId?: string) => void }> = ({
  scrollToStep,
}) => {
  const flowContext = useContext(FlowContext);
  const flow = flowContext?.flow;

  const [treeData, setTreeData] = useState<any[]>([]);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<string | null>(null);

  const updateTranslate = () => {
    const dimensions = document
      .getElementById('treeWrapper')
      ?.getBoundingClientRect();
    if (dimensions) {
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 4,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateTranslate);
    return () => {
      window.removeEventListener('resize', updateTranslate);
    };
  }, []);

  useEffect(() => {
    if (flow) {
      const generateTree = (stepId: string, visited: Set<string>): any => {
        if (visited.has(stepId)) {
          return null; // Circular dependency detected, stop recursion
        }

        visited.add(stepId);

        const step = flow.steps.find((s) => s.id === stepId);
        if (!step) return null;

        const children =
          step.events
            ?.map((event) => generateTree(event.nextStepID, new Set(visited)))
            .filter(Boolean) || [];
        return {
          name: step.id,
          children,
        };
      };

      const rootStep = flow.steps.find((s) => s.id === flow.initialStepID);
      if (rootStep) {
        const treeStructure = generateTree(rootStep.id, new Set());
        if (treeStructure) {
          setTreeData([treeStructure]);
          // Calculate the initial position to center the tree
          updateTranslate();
        } else {
          setTreeData([]);
        }
      }
    }
  }, [flow?.steps, flow?.initialStepID]);

  const handleMouseEnter = (tooltipText: string) => {
    setTooltip(tooltipText);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const renderNode = ({ nodeDatum }: any) => {
    const relatedEvents = flow?.steps.flatMap(
      (step) =>
        step.events
          ?.filter((event) => event.nextStepID === nodeDatum.name)
          .map((event) => ({
            stepId: step.id,
            intent: event.intent,
          })) || [],
    );

    const tooltipText =
      relatedEvents && relatedEvents.length > 0
        ? `Triggered by...\n\n${relatedEvents.map((e) => `- "${e.intent}" in step "${e.stepId}"`).join('\n\n')}`
        : nodeDatum.name === flow?.initialStepID
          ? 'Initial step'
          : '';

    return (
      <g
        onClick={() => scrollToStep(nodeDatum.name)}
        onMouseEnter={() => handleMouseEnter(tooltipText)}
        onMouseLeave={handleMouseLeave}
      >
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
        <foreignObject x="-60" y="-30" width="120" height="60">
          <div className="flex items-center justify-center h-full">
            <span
              className="text-white text-center text-sm truncate"
              title={nodeDatum.name}
            >
              {nodeDatum.name}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div id="treeWrapper" className="w-full h-[800px] relative">
      {tooltip && (
        <div className="absolute bg-black text-white text-sm rounded p-2 top-0 left-1/2 transform -translate-x-1/2">
          {tooltip.split('\n').map((line, index) => (
            <div
              key={index}
              className={index === 1 ? 'mt-2' : index > 1 ? 'mt-1' : ''}
            >
              {line}
            </div>
          ))}
        </div>
      )}
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
