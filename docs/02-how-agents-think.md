# How Agents Think
### Types, Behaviors & Design Patterns

[**Hamza Farooq**](https://github.com/hamzafarooq) and [**Jaya Rajwani**](https://github.com/JayaRajwani)

## **Welcome to Day 2 of the 7-Day Agents in Action Series.**

Hi!

My name is [Hamza](https://www.linkedin.com/in/hamzafarooq/), and I am so excited to welcome you to our new course. Joining me is [Jaya](https://www.linkedin.com/in/jayarajwani/) who is a ninja in Agents!

In these 7 sessions we will uncover all we can about Agents, what they are, how they work and the what’s really behind all this hype?

In Day 1 of the course [Agents are here and they are staying](link), we explored what makes agents different from GenAI chatbots. We saw how vertical agents are domain-specific, tool-using, and memory-augmented digital workers. One critical layer to add to this recipe of vertical agents is: **how do agents actually think?**

Not from a philosophic standpoint but from an architectural standpoint.

When you give an agent a task, for example: "write a report," "search for a policy," "check this document for compliance", how does it decide what to do first? Does it jump in? Does it stop and plan? Does it revise if something goes wrong?

`***"Most agents don’t fail because they lack intelligence. They fail because they don’t know how to think.”***`

![Agent Thinking Method](images/agent-thinking-method.png)
<p>
  <em><a href="https://aiablog.medium.com/new-thinking-method-for-agents-better-than-reasoning-models-fbd71ae77464">New Thinking Method for Agents | Better than reasoning models</a></em>
</p>

That, right there, is where most GenAI builders hit their ceiling. Because you can bolt memory and tools onto an LLM, but if the agent doesn’t have a thinking loop, it breaks down after step one. This is where Agent Thinking Styles come into play.

## **How Agents Think: A Practical Viewpoint**
Let’s start simple. Imagine asking your agent:

`"Summarize this PDF."`

A reactive agent would instantly extract the text, summarize it, and return an answer. No memory. No context. No second thoughts. Done.

Now imagine you ask:

`"Scan these ten compliance policies and alert me to any mismatches with our internal rules."`

That’s not a one-shot task. Now the agent has to:
- Break the request into steps
- Retrieve internal guidelines
- Compare across multiple documents
- Identify inconsistencies
- Possibly ask clarifying questions

This is no longer about reacting. This is thought, action, and observation cycle. And that’s the key takeaway here: agents don’t just differ in what they do - they differ in how they think. This is also sometimes called the agent loop. These components of the loop work as:
1. **Thought**: The LLM part of the Agent decides what the next step should be.
2. **Action**: The agent takes an action, by calling the tools with the associated arguments.
3. **Observation**: The model reflects on the response from the tool.

| ![Query](images/query.png) | ![Think](images/think.png) |
|-----------------------------|-----------------------------|
| ![Act](images/act.png) | ![Observe](images/observe.png) |
<p>
  <em>[Understanding AI Agents through the Thought-Action-Observation Cycle](https://huggingface.co/learn/agents-course/en/unit1/agent-steps-and-structure)</em>
</p>

There are several combinations for this thought-action-observation loop. These combinations determin how we implement intelligent behavior in real systems. Let’s connect these styles to actual design patterns used in today’s GenAI agents.

## **From Theory to Practice: Patterns for Agentic Thinking**

Before the rise of LLMs and agent frameworks like LangChain or AutoGen, the foundations of agent design were already well-established in classical AI literature. These ideas came from robotics, planning systems, and decision theory, and they remain relevant even in the era of language-based agents.
- **Reactive agents**: First formalized in Rodney Brooks’ behavior-based robotics and detailed in Russell & Norvig’s Artificial Intelligence: A Modern Approach, reactive agents respond instantly to stimuli without building internal models of the world. They’re designed for speed and simplicity, often using a condition-action mapping. Think of a thermostat or a chatbot that immediately replies to inputs. ([Russell & Norvig, AIMA, Brooks, 1986](https://aima.cs.berkeley.edu/))
- **Deliberative (Planning) agents**: First modeled through systems like STRIPS (Fikes & Nilsson, 1971) and formalized by Georgeff & Lansky in 1987, these agents reason about the world, create internal representations, and plan sequences of actions. In today's GenAI landscape, they map naturally to plan-act-reflect agents ([Georgeff & Lansky, 1987](https://dl.acm.org/doi/10.5555/1856740.1856792))
- **Hybrid agents**: Introduced by Michael Wooldridge and Nicholas Jennings, hybrid agents blend reactive and deliberative thinking. A lower-level reactive layer handles real-time decisions, while a higher-level planner works on strategic goals. Modern multi-agent systems often mimic this design. ([Wooldridge & Jennings, 1995](link))
- **Reflective/meta agents**: While the idea of meta-reasoning dates back to early expert systems, it gained new relevance in the era of LLMs. Shinn et al.’s Reflexion framework (2023) offers a modern interpretation: agents that monitor and critique their own outputs, learning from previous mistakes to improve future performance. This is the seed of what may become long-term, self-improving AI systems. ([Shinn et al., 2023 – Reflexion](https://arxiv.org/abs/2303.11366))

![Reasoning Processes](images/reasoning_processes.png)

These styles aren’t just historical curiosities, they’re directly informing how we design GenAI agents today. ReAct builds on reactive behavior. Plan-Act-Reflect agents are rooted in deliberative logic. And modern memory-augmented, self-improving agents reflect the beginnings of true reflective cognition.

## **Case Study: How Thinking Style Impacts Agent Performance**

A recent study, [Agents Thinking Fast and Slow: A Talker-Reasoner Architecture](https://arxiv.org/abs/2410.08328), introduces a dual-agent architecture based on Daniel Kahneman’s Thinking Fast and Slow model. Their system consists of:

- A Talker (System 1): Fast, intuitive, conversational - akin to reactive behavior.
- A Reasoner (System 2): Slow, strategic, deliberative - responsible for planning, tool use, and memory updates.

This architecture was demonstrated in a sleep coaching agent that converses with users while planning interventions behind the scenes. The paper concluded that:

`“Architectural design decisions, especially around planning and memory, play a greater role than model size alone.”`

This reinforces the idea that how your agent thinks matters more than how big your LLM is. Architecting a strong planning and reflection loop is key to solving complex, multi-step tasks — especially in vertical use cases like finance, legal ops, or engineering.

Let’s connect these styles to actual design patterns used in today’s GenAI agents.

![GenAI Agents](images/gen-ai-agents.png)

## **Design Patterns for Agents**

Here’s the real deal: these thinking modes don’t just live in academic papers or theoretical frameworks, they directly shape how agents behave in production. Every agent architecture, from simple assistants to full-blown autonomous systems, must decide how to think. That thinking isn’t random - it follows design patterns.

Design patterns are recurring, proven strategies that define how an agent processes information, uses tools, and makes decisions. They’re the mental blueprints behind agent cognition, and just like software design patterns, they help developers avoid reinventing the wheel.

![Agentic Design Patterns](images/agentic-design-patterns.png)
<p>
  <em>[Agentic Design Patterns](https://medium.com/%40bijit211987/agentic-design-patterns-cbd0aae2962f)</em>  
</p>

Let’s explore how we implement these styles using design patterns - and when to use each.
