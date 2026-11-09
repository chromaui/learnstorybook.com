---
title: 'Get started with AI in Storybook'
tocTitle: 'Get started'
description: 'Learn how to use Storybook MCP and skills to provide context to your coding agents'
---

Coding agents, like human developers, write better code when they have access to all relevant information. Brand guidelines, design principles, reusable components all help agents produce higher-quality UI that feels at home in your app. Coding agents, like human developers, need to learn your components' APIs, recommended patterns, when to use which component, and so on.

Design systems are where a lot of this information lives. They contain reusable components with usage instructions, brand and UX guidelines, design tokens, accessibility guidance and technical requirements for developers to use the system. By giving coding agents access to that context, you can elevate the quality of their work.

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/latest/getting-started/intro) and [agent skills](https://agentskills.io/home) are the industry standard methods developers use to provide context to coding agents. With Storybook, you can document both your components and guidelines, and forward all of that knowledge to agents in a breeze. Storybook provides both an MCP server, that you can publish for free to Chromatic, and agent skills.

In this chapter, we'll learn how to install Storybook and its AI tools, verify that it works as intended, and publish it to Chromatic for your teams to use.

## Install Storybook with AI features

If you don't use Storybook yet, you can install it with the following command:

```sh packageManager=npm
npx storybook init
```

```sh packageManager=pnpm
pnpx --allow-build=esbuild storybook init
```

```sh packageManager=yarn
yarn exec storybook init
```

As the install progresses, Storybook will offer to install agent skills in your project. Skills help you develop design system components and write stories more efficiently, as we'll see in the next chapter. If you want to install skills for another agent later, you can use [the `skills` package](https://github.com/vercel-labs/skills/blob/main/docs/agents.md):

```sh packageManager=npm
npx skills add storybookjs/skills --yes --copy --agent opencode
```

```sh packageManager=pnpm
pnpx --allow-build=esbuild skills add storybookjs/skills --yes --copy --agent opencode
```

```sh packageManager=yarn
yarn exec skills add storybookjs/skills --yes --copy --agent opencode
```

<p class="aside">
ℹ️ The following frameworks support Storybook's AI features: Angular, React (including Next, Next Vite, TanStack and React Native), Vue (including Nuxt), Svelte, SolidJS and Astro.
</p>

We'll see in the next chapters how to write great Storybook content and how to exploit Storybooks AI skills. But first, let's ensure your product teams' agents can also reach your Storybook.

## Publish your first Storybook MCP

Skills work for your local project, but not for your product teams that consume Storybook as a documentation website. To support remote teams, you'll need to publish a Storybook MCP server. Your organization's teams will then be able to use the server as a source of truth for design system context.

Chromatic offers free MCP server publishing to Storybook users. To get started with Chromatic, [sign up for a free account](https://chromatic.com/start), install Chromatic on your project and run a Chromatic build. If you have specific requirements like SSO, see the [Chromatic quick start](https://www.chromatic.com/docs/quickstart/) guide.

```sh packageManager=npm
npm install --save-dev chromatic
npx chromatic --project-token <your-project-token>
```

```sh packageManager=pnpm
pnpm add --save-dev chromatic
pnpm chromatic --project-token <your-project-token>
```

```sh packageManager=yarn
yarn add --dev chromatic
yarn chromatic --project-token <your-project-token>
```

Every project in Chromatic has a unique `appId`. You can find the published Storybook (and MCP server) for a given branch or release by using the following URL: `https://<branch>--<appId>.chromatic.com`. Assuming your release branch is `main`, and your `appId` is `1234567890`, the URL to your MCP server is found by appending `/mcp`: `https://main--1234567890.chromatic.com/mcp`.

## Set the MCP up for developers' agents

Now that your design system has a MCP server online, product teams can install it in their local repositories for their agents to use.

```sh packageManager=npm
npx mcp-add --type http --url "https://main--1234567890.chromatic.com/mcp" --client-id "cdf3737dff9d485485968e50b63fd8b4" --scope project --name Storybook
```

```sh packageManager=pnpm
pnpx mcp-add --type http --url "https://main--1234567890.chromatic.com/mcp" --client-id "cdf3737dff9d485485968e50b63fd8b4" --scope project --name Storybook
```

```sh packageManager=yarn
yarn exec mcp-add --type http --url "https://main--1234567890.chromatic.com/mcp" --client-id "cdf3737dff9d485485968e50b63fd8b4" --scope project --name Storybook
```

The MCP should now be reachable. Developers can check their agent has access to the MCP by asking it to list available components in the design system. The agent should then call the `docs-list` tool from the MCP server.

<p class="aside">
ℹ️ In some agents like Claude Code, developers must manually approve new MCP servers. Developers should check the MCP server is enabled with their agent's tools in case it is not found.
</p>
