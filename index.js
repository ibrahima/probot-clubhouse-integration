module.exports = (robot) => {
  const storyRe = /ch\d+/;
  console.log('Yay, the app was loaded!');

  robot.on('pull_request.labeled', async context => {
    robot.log.info('Pull request labeled!');
    const labelName = context.payload.label.name;
    const branchName = context.payload.pull_request.head.ref;
    const storyId = storyRe.exec(branchName);
    robot.log(labelName, branchName, storyId);
  });

  robot.on('pull_request.unlabeled', async context => {
    robot.log.info('Pull request unlabeled!');
    const labelName = context.payload.label.name;
    const branchName = context.payload.pull_request.head.ref;
    const storyId = storyRe.exec(branchName);
    robot.log(labelName, branchName, storyId);
  });
};
