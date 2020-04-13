let imgCounter = 0;
let dir = 'create_and_join_game';

export function changeDir(newDir: string) {
  imgCounter = 0;
  dir = newDir;
}

export function screenshotName(name: string) {
  imgCounter += 1;
  return 'screenshots/'
    .concat(dir)
    .concat('/')
    .concat(imgCounter.toString(10))
    .concat('_')
    .concat(name)
    .concat('.png');
}
