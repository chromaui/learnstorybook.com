---
title: "Wire in data"
---


# Wire in data
So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components
Our `TaskList` component as currently written is “presentational” (see [blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”. 

This example uses [Redux](https://redux.js.org/), the most popular React library for storing data, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

First we’ll construct a simple Redux store that responds to actions that change the state of tasks, in a file called `lib/redux.js` (intentionally kept simple):

...code

Then we’ll update the default export from the `TaskList` component to connect to the Redux store and render the tasks we are interested in

...code

At this stage our Storybook tests will have stopped working, as the TaskList no longer takes any props, but instead connects to the store and sets the props for the `PureTaskList` component it wraps. 

However, we can easily solve this problem by simply rendering the `PureTaskList` --the presentational component-- in our Storybook stories:

...code
