module.exports = (robot) => {
  console.log('Yay, the app was loaded!');

  robot.on('pull_request.labeled', async context => {
    robot.log.info('Pull request labeled!');
    const name = context.payload.label.name;
    robot.log(name);
  });

  robot.on('pull_request.unlabeled', async context => {
    robot.log.info('Pull request unlabeled!');
    const name = context.payload.label.name;
    robot.log(name);
  });
};
