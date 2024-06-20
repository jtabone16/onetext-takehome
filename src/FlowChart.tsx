import React, { useContext, useEffect, useState, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    Node,
    Edge,
    Position
} from 'react-flow-renderer';
import dagre from 'dagre';
import { FlowContext } from './FlowContext';
import { v4 as uuidv4 } from 'uuid';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 60;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = Position.Top;
        node.sourcePosition = Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

const FlowChart: React.FC<{ scrollToStep: (stepId?: string) => void }> = ({ scrollToStep }) => {
    const flowContext = useContext(FlowContext);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const flow = flowContext?.flow;

    useEffect(() => {
        if (flow) {
            const newNodes: Node[] = flow.steps.map((step) => ({
                id: step.id,
                data: { label: step.id },
                position: { x: 0, y: 0 },
                style: {
                    width: nodeWidth,
                    height: nodeHeight,
                    background: '#007AFF',
                    color: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '10px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                },
                onClick: () => scrollToStep(step.id),
                key: uuidv4()
            }));

            const newEdges: Edge[] = flow.steps.flatMap((step) =>
                (step.events || []).map((event) => ({
                    id: uuidv4(),
                    source: step.id,
                    target: event.nextStepID,
                    arrowHeadType: 'arrowclosed',
                    animated: true,
                }))
            );

            const layoutedElements = getLayoutedElements(newNodes, newEdges);

            setNodes(layoutedElements.nodes);
            setEdges(layoutedElements.edges);
        }
    }, [flow, scrollToStep]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    return (
        <div style={{ height: 500, width: '100%' }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onConnect={onConnect}
                    style={{ background: '#A2D2FF' }}
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default FlowChart;
