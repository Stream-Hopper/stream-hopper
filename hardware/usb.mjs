import util from 'util';
import child_process from 'child_process';
import fs from 'fs';

const exec = util.promisify(child_process.exec);

class USBAPI {
  async init(){
    if(!fs.existsSync('./uhubctl')){
      const { stdout, stderr } = await exec('./setup.sh')
      .catch(err => {
        console.log(err);
      });
    }
  }

  async turnOffUSBPorts() {
    if(fs.existsSync('./uhubctl')){
      const { stdout, stderr } = await exec('sudo uhubctl/uhubctl -l 1-1 -a 0 -r 10')
      .catch(err => {
        console.log(err);
      });
    }else{
      console.log('uhubctl not installed... Please run ./setup.sh');
    }
  }

  async turnOnUSBPorts() {
    if(fs.existsSync('./uhubctl')){
      const { stdout, stderr } = await exec('sudo uhubctl/uhubctl -l 1-1 -a 1 -r 10')
      .catch(err => {
        console.log(err);
      });
    }else{
      console.log('uhubctl not installed... Please run ./setup.sh');
    }
  }
}

export { USBAPI };
