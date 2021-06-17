//"use strict";

// globals
const width = 500;
const height = 500;
let trail = new Float32Array(width * height);

// config
const settings = {
  AGENT_SPEED: 2,
  // DIFFUSSION_WEIGHTS: [
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  //   1 / 9,
  // ],
  DIFFUSSION_WEIGHTS: [
    1 / 16,
    1 / 8,
    1 / 16,
    1 / 8,
    1 / 4,
    1 / 8,
    1 / 16,
    1 / 8,
    1 / 16,
  ],
  // DIFFUSSION_WEIGHTS: [0.05, 0.1, 0.05, 0.1, 0.4, 0.1, 0.05, 0.1, 0.05],
  DEPOSIT_AMOUNT: 10,
  DECAY_FACTOR: 0.9,
  AGENT_COUNT: 2,
  SENSOR_ANGLE: (80 / 180) * Math.PI,
  TURNING_ANGLE: (80 / 180) * Math.PI,
  SENSOR_DISTANCE: 10,
  TURNING_STRENGTH: 1,
};

const colors = {
  background: [34, 35, 35],
  agents: [240, 235, 240],
};

// actions
const actions = {
  agentGeneration: true,
  agentMovement: false,
  agentRotation: false,
  deposit: false,
  diffuse: false,
  decay: false,
};

//helpers
function index(raw_x, raw_y) {
  let x = raw_x;
  let y = raw_y;
  if (x <= 0) x += width;
  if (x >= width) x -= width;
  if (y <= 0) y += height;
  if (y >= height) y -= height;
  return x + y * width;
}

onload = function () {
  // Set canvas dimensions to fullscreen
  const canvas = document.getElementById("simcanvas");
  canvas.width = width;
  canvas.height = height;
  const agents = [];

  function generate_agents() {
    // erases all agents, generates new random ones
    agents.splice(0, agents.length);
    for (let n = 0; n < settings.AGENT_COUNT; ++n) {
      agents.push({
        x: Math.random() * width,
        y: Math.random() * height,
        angle: Math.random() * 2 * Math.PI,
      });
    }
    actions.agentGeneration = false;
  }

  function get_sensed_value(agent, angle) {
    return trail[
      index(
        Math.round(
          agent.x + Math.sin(agent.angle + angle) * settings.SENSOR_DISTANCE
        ),
        Math.round(
          agent.y + Math.cos(agent.angle + angle) * settings.SENSOR_DISTANCE
        )
      )
    ];
  }

  function sense() {
    for (let agent of agents) {
      const sensor = [
        get_sensed_value(agent, settings.SENSOR_ANGLE),
        get_sensed_value(agent, 0),
        get_sensed_value(agent, -settings.SENSOR_ANGLE),
      ];

      const i = sensor.indexOf(Math.max(...sensor)) - 1;

      if (i === 0) {
      } else if (sensor[0] > sensor[2]) {
        agent.angle += settings.SENSOR_ANGLE;
      } else {
        agent.angle -= settings.SENSOR_ANGLE;
      }

      //   console.log(sensor);

      agent.angle += i * settings.TURNING_STRENGTH;
    }
  }

  function move_agents() {
    for (let agent of agents) {
      agent.x += settings.AGENT_SPEED * Math.sin(agent.angle);
      agent.y += settings.AGENT_SPEED * Math.cos(agent.angle);
      // add periodic boundary conditions
      if (agent.x <= 0) agent.x += width;
      if (agent.x >= width) agent.x -= width;
      if (agent.y <= 0) agent.y += height;
      if (agent.y >= height) agent.y -= height;
    }
  }

  function deposit() {
    for (let agent of agents) {
      const x = Math.round(agent.x);
      const y = Math.round(agent.y);
      trail[index(x, y)] += settings.DEPOSIT_AMOUNT;
    }
  }

  function diffuse_and_decay() {
    const old_trail = Float32Array.from(trail);
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x <= width; ++x) {
        const diffused_value = actions.diffuse
          ? old_trail[index(x - 1, y - 1)] * settings.DIFFUSSION_WEIGHTS[0] +
            old_trail[index(x, y - 1)] * settings.DIFFUSSION_WEIGHTS[1] +
            old_trail[index(x + 1, y - 1)] * settings.DIFFUSSION_WEIGHTS[2] +
            old_trail[index(x - 1, y)] * settings.DIFFUSSION_WEIGHTS[3] +
            old_trail[index(x, y)] * settings.DIFFUSSION_WEIGHTS[4] +
            old_trail[index(x + 1, y)] * settings.DIFFUSSION_WEIGHTS[5] +
            old_trail[index(x - 1, y + 1)] * settings.DIFFUSSION_WEIGHTS[6] +
            old_trail[index(x, y + 1)] * settings.DIFFUSSION_WEIGHTS[7] +
            old_trail[index(x + 1, y + 1)] * settings.DIFFUSSION_WEIGHTS[8]
          : old_trail[index(x, y)];

        trail[index(x, y)] =
          diffused_value * (actions.decay ? settings.DECAY_FACTOR : 1);
      }
    }
  }

  function render() {
    const ctx = canvas.getContext("2d");
    const trail_image = ctx.getImageData(0, 0, width, height);

    let i = 0;
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const colorIntensity = trail[i];
        trail_image.data[i * 4 + 0] = Math.max(
          colors.background[0],
          Math.floor(colorIntensity * colors.agents[0])
        );
        trail_image.data[i * 4 + 1] = Math.max(
          colors.background[1],
          Math.floor(colorIntensity * colors.agents[1])
        );
        trail_image.data[i * 4 + 2] = Math.max(
          colors.background[2],
          Math.floor(colorIntensity * colors.agents[2])
        );
        trail_image.data[i * 4 + 3] = 255; // opacity
        i++;
      }
    }

    for (let agent of agents) {
      trail_image.data[
        (Math.floor(agent.x) + Math.floor(agent.y) * width) * 4 + 0
      ] = colors.agents[0];
      trail_image.data[
        (Math.floor(agent.x) + Math.floor(agent.y) * width) * 4 + 1
      ] = colors.agents[1];
      trail_image.data[
        (Math.floor(agent.x) + Math.floor(agent.y) * width) * 4 + 2
      ] = colors.agents[2];
    }

    ctx.putImageData(trail_image, 0, 0);
  }

  function next_frame() {
    actions.agentGeneration && generate_agents();
    actions.agentRotation && sense();
    actions.agentMovement && move_agents();
    actions.deposit && deposit();
    diffuse_and_decay();
    render(canvas, agents);

    window.requestAnimationFrame(next_frame);
  }
  next_frame();
  checkActions();
  checkSettings();
};

function checkActions() {
  for (let name in actions) {
    console.log(settings, actions);
    let checkBox = document.getElementById(name);
    if (!checkBox) continue;
    actions[name] = checkBox.checked;
  }
}

function checkSettings() {
  console.log(settings, actions);
  for (let name in settings) {
    let slider = document.getElementById(name);
    if (!slider) continue;

    if (name.includes("ANGLE")) {
      settings[name] = (parseFloat(slider.value) / 180) * Math.PI;
    } else {
      settings[name] = parseFloat(slider.value);
    }
  }
}
