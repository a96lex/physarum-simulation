# :microscope: Slime mold simulator

Instrumentalization of the generation of complex structures created by simple agents. Live version available [here](http://scom-physarum-2021.s3-website-eu-west-1.amazonaws.com/)

## :grey_question: Introduction

> Slime mold or is an informal name given to several kinds of unrelated eukaryotic organisms that can live freely as single cells, but can aggregate together to form multicellular reproductive structures. - [Wikipedia](https://en.wikipedia.org/wiki/Slime_mold)

The goal of this project is to simulate the complex structures formed spontaneously by these organisms.

## :dizzy: Agents

The approach followed is the generation of numerous agents. An agent is a particle with a set behaviour.

In this simulation, agents will be randomly generated in a 2D space. They will leave a trail wherever they are. This trail will be diffused using a diffusion kernel, and will decay over time.

Agents will have a prefered direction depending on the amount of trail they sense in their vecinity.

Agents have these simple properties, which can be modified by the user at runtime:

- Sensor distance: how far ahead the agent can sense its sorroundings
- Sensor angle: how wide it's field of vision is
- Turning angle: how strongly an agent can steer to its desired direction
- Speed: how fast an agent can move
- Deposit amount: how stronng the trail of the agent is

## :computer: Stack

This project has been developed using simple web technologies:

- vanilla js for the simulation
- HTML and css for UX/UI

## :shipit: How to contribute

Your comments are always welcome. You can add them as [Issues](https://github.com/a96lex/fractal-potential-2d-frontend/issues) and I will have a look

However, if you wish to directly contribute to improve code quality or add features, you can also do so by forking the repository and sending a pull request.

## :books: References

- Sebastian League's [video](https://www.youtube.com/watch?v=X-iSQQgOd1A&ab_channel=SebastianLague)
- Johshoff's [code](https://github.com/johshoff/physarum)
- Based on Jeff Jones's [paper](https://uwe-repository.worktribe.com/output/980579)
