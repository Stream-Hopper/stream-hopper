import util from 'util';
import child_process from 'child_process';
const exec = util.promisify(child_process.exec);

class GPIOAPI{
    async toggle(port, mode){
        await exec(`python gpio.py ${port} ${mode}`);
    }
}

export { GPIOAPI }