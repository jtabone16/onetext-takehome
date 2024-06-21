# Messaging Flow Builder

Welcome to the messaging flow builder! This tool is designed to help you create a messaging flow as per the
requirements listed [here](https://gist.github.com/bluepnume/83ba618981b9ea6a09ff48bdcdd43e31#follow-up-exercise).

## Getting Started

To get started, you will need to follow the steps below:
- Clone the repository
- Install the dependencies via `npm install`
- Run the application via `npm start` (and admire how fast Vite is)

## Usage

The application is designed to allow users to create a messaging flow that consists of an `initialStepID` and `steps`. 

Each `step` has an `id` (i.e. step name),`type` (note that we currently only support `message`type for steps), `message` (the message to be texted to the user),
and `events`. 

The `events` array contains events that can trigger a step in the flow. Note that an event cannot trigger its own step.
Each event has a `type`  (note that we currently only support `reply` type for events),
`intent` (i.e. a string that describes the intent of the user's reply), and a 
`nextStepID` (i.e. the step that should be triggered if the user's reply matches the intent).

That being said, users can either build out flows manually by clicking `Add Step` and `Add Event` buttons or by importing a JSON file that contains the flow.
They can also export a flow to a JSON file. Try importing the included `pizza_test_values.json` :)

Users can also reset the flow by clicking the `Reset` button and save the flow to local browser storage by clicking the `Save` button.

Lastly, as the user builds out a flow, they can see a visual representation of the flow on the left side of the screen.

## Technologies Used
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)
- [Vite](https://github.com/vitejs/vite)
- [React](https://github.com/facebook/react)
- [HeroIcons](https://github.com/tailwindlabs/heroicons)
- [React D3 Tree](https://github.com/bkrem/react-d3-tree)
- [React-select](https://github.com/JedWatson/react-select)
- [Typescript](https://github.com/microsoft/TypeScript)
- [Uuid](https://github.com/uuidjs/uuid)

## Future Improvements

Oh do I have a lot of ideas for this project! Here are a few:

- Add support for different step and event types. Maybe phone calls and using a touch tone pad?
- Light/dark mode
- More accessibility features i.e. keyboard navigation, screen reader support, color contrast, etc
- More robust validation and error handling
- Testing with RTL
- Build out component library with Radix-UI (or something similar, free accessability out of the box!) and Storybook for better reusability. Leverage their visual regression testing and a11y plugins.
- Leverage a UI library like Tailwind UI, Chakra UI or Material UI for more consistent styling. Or just build components from scratch via Radix-UI.
- Add more animations and transitions to make the UI more engaging and snappier e.g when saving steps or events on blur, importing a flow, etc
- Preview mode to test a flow in real time
- Ability to search and filter steps and events
- More robust validation and error handling e.g. if user imports a faulty JSON eg steps with the same name
- Better tooltips on hover of tree nodes, was having trouble rendering tooltips with React D3 Tree
- Pick a better color scheme, I do have some design chops, but I wanted to focus on functionality and UX first and foremost. Working with OneText brand colors would be fun!
- Indicate that a step or event is being hovered over in the tree/builder view
- Indicate that a step or event is being hovered over in the form view
- Indicate whether a step is "incomplete" i.e. missing an event that triggers it. Similarly, if an event is missing a nextStepID
- Implement a true no-code drag and drop interface for building out flows. Less typing, more clicking when dealing with often used steps and events
- I could've made the components a bit more testable by breaking them down into smaller, testable components. I was trying to keep the number of components to a minimum to reduce complexity, but I could've done a better job of this for sure.  
 However, given the time constraints, I wanted to focus on functionality and UX first and foremost. Even added a couple features that weren't in the requirements :)
- Create more CSS classes for reusability and to keep the codebase DRY. Had some at first, but decided to inline styles for simplicity and speed of development.

## Conclusion

I had a lot of fun building this project! I hope you enjoy using it as much as I enjoyed building it. I look forward to hearing your feedback and suggestions for improvements. Feel free to reach out to me at [my email](mailto:jtabone16@gmail.com) or [LinkedIn](https://www.linkedin.com/in/jtabone16/). Thanks for the opportunity!