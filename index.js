const Clubhouse = require('clubhouse-lib');

class ClubhouseClient {
  constructor() {
    this.client = Clubhouse.create(process.env.CLUBHOUSE_API_TOKEN);

    this.states = this.client.listWorkflows().then((data) => {
      this.states = data[0].states;
    });
  }

  async updateStoryState(storyId, state) {
    const stateId = await this.getStateId(state);
    this.client.updateStory(storyId, {workflow_state_id: stateId});
  }

  async getStateId(name) {
    const states = await this.states;
    const state = states.find(s => s.name === name);
    return state && state.id;
  }
}

function clubhouseStoryId(pullRequest) {
  const storyRe = /ch(\d+)/;
  const branchName = pullRequest.head.ref;
  const match = storyRe.exec(branchName);
  return match && match[1];
};

module.exports = (robot) => {
  const client = new ClubhouseClient();
  console.log('Yay, the app was loaded!');

  robot.on('pull_request.labeled', async context => {
    robot.log.debug('Pull request labeled!');
    const labelName = context.payload.label.name;
    const storyId = clubhouseStoryId(context.payload.pull_request);

    if (labelName === 'ready for review') {
      if (storyId) {
        robot.log.debug(`Moving story ${storyId} to "Ready for Review"`);
        client.updateStoryState(storyId, 'Ready for Review');
      }
    }
  });

  robot.on('pull_request.unlabeled', async context => {
    const labelName = context.payload.label.name;
    const storyId = clubhouseStoryId(context.payload.pull_request);

    if (labelName === 'ready for review') {
      robot.log.debug('Pull request unlabeled!');
      if (storyId) {
        robot.log.debug(`Moving story ${storyId} back to "In Development"`);
        client.updateStoryState(storyId, 'In Development');
      }
    }
  });
};
