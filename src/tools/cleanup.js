const fs = require('fs');
const Path = require('path');

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const currentPathToFile = Path.join(path, file);
      if (fs.lstatSync(currentPathToFile).isDirectory()) {
        deleteFolderRecursive(currentPathToFile);
      } else {
        fs.unlinkSync(currentPathToFile);
      }
    });
    fs.rmdirSync(path);
  }
};

const folder = process.argv.at(2);

deleteFolderRecursive(Path.join(__dirname, '../../', folder));
